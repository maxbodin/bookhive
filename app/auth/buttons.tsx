"use client";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const supabase = createClient();

export function AuthButtons() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setInitialLoading(false);
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

    setIsSigningIn(true);

    setTimeout(async () => {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;

        toast.success("Check your email for the login link!");
      } catch (error: any) {
        toast.error(error.error_description || error.message);
      } finally {
        setIsSigningIn(false);
      }
    }, 30000);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
      } catch (error: any) {
        toast.error(error.error_description || error.message)
      } finally {
        setIsSigningOut(false);
      }
    }, 1500);
  };

  if (initialLoading) {
    return null;
  }

  return (
    <div>
      {session ? (
        <Button onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? <Spinner /> : "Sign out"}
        </Button>
      ) : (
        <div className="flex flex-row gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSigningIn}
          />
          <Button onClick={handleSignIn} disabled={isSigningIn}>
            {isSigningIn ? <Spinner /> : "Sign in"}
          </Button>
        </div>
      )}
    </div>
  );
}