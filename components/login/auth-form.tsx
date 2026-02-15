"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AuthFormContent from "@/components/login/auth-form-content";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">( "signin" );

  return (
    <Card className="flex flex-col w-full max-w-lg items-center justify-center p-12 border-muted mt-8 mb-12">
      <CardHeader className="text-left">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            { mode === "signup" ? "Create an account" : "Welcome back" }
          </CardTitle>
        </div>

        <div className="grid w-full grid-cols-2 rounded-lg bg-muted p-1">
          { [
            { id: "signin", label: "Sign in" },
            { id: "signup", label: "Sign up" },
          ].map( ( tab ) => (
            <button
              key={ tab.id }
              type="button"
              onClick={ () => setMode( tab.id as "signin" | "signup" ) }
              className={ cn(
                "flex h-6 items-center justify-center rounded-md text-sm transition-all",
                mode === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              ) }
            >
              { tab.label }
            </button>
          ) ) }
        </div>
      </CardHeader>

      <CardContent className="p-6 w-full">
        <AuthFormContent key={ mode } mode={ mode }/>
      </CardContent>
    </Card>
  );
}