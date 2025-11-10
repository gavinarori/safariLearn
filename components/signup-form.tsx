"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/auth";
import { useRouter } from 'next/navigation'

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const { signUp } = useAuth();
  const router = useRouter()

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"trainer" | "learner">("learner");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatars = [
    "/averagebulk@192.webp",
    "/batperson@192.webp",
    "/gordon@192.webp",
    "/idiotsandwich@192.webp",
    "/spiderperson@192.webp",
    "/superperson@192.webp",
    "/wonderperson@192.webp",
    "/yellingcat@192.webp",
    "/yellingwoman@192.webp",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, {
        full_name: fullName,
        role,
        avatar_url: avatarUrl || null,
        bio: bio || null,
      });
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="fullName">Full name</FieldLabel>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </Field>

<Field>
  <FieldLabel htmlFor="role">Role</FieldLabel>
  <ToggleGroup
    type="single"
    value={role}
    onValueChange={(value) => value && setRole(value as "learner" | "trainer")}
    className="justify-center"
  >
    <ToggleGroupItem
      value="learner"
      aria-label="Select learner"
      className="px-6 py-2 rounded-md text-sm data-[state=on]:bg-primary data-[state=on]:text-white border"
    >
      Learner
    </ToggleGroupItem>
    <ToggleGroupItem
      value="trainer"
      aria-label="Select trainer"
      className="px-6 py-2 rounded-md text-sm data-[state=on]:bg-primary data-[state=on]:text-white border"
    >
      Trainer
    </ToggleGroupItem>
  </ToggleGroup>
  <FieldDescription>Select your role on the platform.</FieldDescription>
</Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Choose an Avatar</FieldLabel>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" type="button" className="flex items-center gap-2">
                {avatarUrl ? (
                  <Avatar>
                    <AvatarImage src={avatarUrl} alt="Selected Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ) : (
                  "Select Avatar"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Select Your Avatar</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {avatars.map((src, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setAvatarUrl(src)}
                    className={cn(
                      "rounded-full overflow-hidden border-2 transition-all",
                      avatarUrl === src ? "border-primary scale-105" : "border-transparent hover:border-muted"
                    )}
                  >
                    <Image src={src} alt={`Avatar ${index + 1}`} width={64} height={64} />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <FieldDescription>Pick a preset avatar. You can change it later.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="bio">Short bio (optional)</FieldLabel>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people what you teach or what you want to learn..."
            rows={3}
          />
        </Field>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
