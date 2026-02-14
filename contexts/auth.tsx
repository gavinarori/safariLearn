"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/superbase/client";

type UserProfile = {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url?: string | null;
  bio?: string | null;
  role?: "super_admin" | "company_admin" | "employee";
  company_id?: string | null;
};

interface AuthContextType {
  user: UserProfile | null;
  sessionReady: boolean;
  signUp: (
    email: string,
    password: string,
    profile?: Partial<UserProfile>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  const loadProfile = async (authUser: any) => {
    if (!authUser) return setUser(null);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error:", error);
      return;
    }

    // auto create profile if missing
    if (!data) {
      const { data: created, error: insertError } = await supabase
        .from("users")
        .insert({
          id: authUser.id,
          email: authUser.email,
          role: "employee",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Profile auto-create error:", insertError);
        return;
      }

      setUser(created);
      return;
    }

    setUser(data);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) await loadProfile(session.user);

      setSessionReady(true);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) await loadProfile(session.user);
        else setUser(null);
      }
    );

    return () => data.subscription.unsubscribe();
  }, []);


  const signUp = async (
    email: string,
    password: string,
    profile: Partial<UserProfile> = {}
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Signup failed");


    await supabase.from("users").insert({
      id: data.user.id,
      email,
      full_name: profile.full_name ?? null,
      avatar_url: profile.avatar_url ?? null,
      bio: profile.bio ?? null,
      role: profile.role ?? "employee",
    });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;
  };


  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    sessionReady,
    signUp,
    signIn,
    signOut,
  };

  return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
