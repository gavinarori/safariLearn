"use client"

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
  role?: "trainer" | "learner";
  created_at?: string;
  updated_at?: string;
};

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profile?: {
      full_name?: string;
      role?: "trainer" | "learner";
      avatar_url?: string | null;
      bio?: string | null;
    }
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
    } else {
      setUser(data);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }

      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchUserProfile(session.user.id);
      else setUser(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const signUp = async (
    email: string,
    password: string,
    profile: {
      full_name?: string;
      role?: "trainer" | "learner";
      avatar_url?: string | null;
      bio?: string | null;
    } = {}
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    const newUser = data.user;
    if (newUser) {
      const now = new Date().toISOString();
      const profileData = {
        id: newUser.id,
        email,
        full_name: profile.full_name ?? "",
        role: profile.role ?? "learner",
        avatar_url: profile.avatar_url ?? null,
        bio: profile.bio ?? null,
        created_at: now,
        updated_at: now,
      };

      const { error: insertError } = await supabase
        .from("users")
        .insert([profileData]);

      if (insertError) {
        console.error("Error inserting user profile:", insertError);
        throw insertError;
      }

      await fetchUserProfile(newUser.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
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
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
