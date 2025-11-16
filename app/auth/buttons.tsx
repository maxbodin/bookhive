"use client";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const supabase = createClient();

export function AuthButtons() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    if (!email) {
      toast.warning("Please enter your email address.");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/${email}`,
        },
      });
      if (error) throw error;

      toast.success("Check your email for the login link!");
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return null;
  }

  return (
    <div>
      {session ? (
        <Button onClick={handleSignOut}>Sign out</Button>
      ) : (
        <div className="flex flex-row gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSignIn}>Sign in</Button>
        </div>
      )}
    </div>
  );
}