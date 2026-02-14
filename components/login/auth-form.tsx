"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, MailIcon, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { login, signInWithOtp, signup } from "@/app/login/actions";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldLabel } from "@/components/ui/field";
import SubmitButton from "./submit-button";
import passwordStrength from "@/lib/passwordStrength";
import PasswordStrengthMeter from "@/components/login/password-strength-meter";


export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">( "signin" );
  const [showPassword, setShowPassword] = useState<boolean>( false );
  const [passwordInput, setPasswordInput] = useState<string>( "" );

  const passwordScore: number = passwordStrength( passwordInput );

  const clientActionLogin = async ( formData: FormData ) => {
    const result = await login( formData );
    if (result?.error) {
      toast.error( result.error );
    }
  };

  const clientActionSignup = async ( formData: FormData ) => {
    const result = await signup( formData );
    if (result?.error) {
      toast.error( result.error );
    } else
      if (result?.success) {
        toast.success( result.success );
      }
  };

  const clientActionMagicLink = async ( formData: FormData ) => {
    const result = await signInWithOtp( formData );
    if (result?.error) {
      toast.error( result.error );
    } else
      if (result?.success) {
        toast.success( result.success );
      }
  };

  return (
    <Card className="flex flex-col w-full max-w-lg items-center justify-center p-12  border-muted mt-8 mb-12">
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

      <CardContent className="p-6">
        <form className="space-y-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <InputGroupAddon>
                <MailIcon className="h-4 w-4 text-muted-foreground"/>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="password"
                name="password"
                value={ passwordInput }
                onChange={ ( e ) => setPasswordInput( e.target.value ) }
                type={ showPassword ? "text" : "password" }
                placeholder="Enter your password"
                required
                minLength={ mode === "signup" ? 8 : 1 }
              />
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={ () => setShowPassword( !showPassword ) }
                  className="text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={ -1 }
                >
                  { showPassword ? (
                    <EyeOff className="h-4 w-4"/>
                  ) : (
                    <Eye className="h-4 w-4"/>
                  ) }
                </button>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          { mode === "signup" && <PasswordStrengthMeter passwordScore={ passwordScore }/> }

          <div className="pt-2">
            <SubmitButton
              formAction={ mode === "signin" ? clientActionLogin : clientActionSignup }
            >
              { mode === "signup" ? "Create account" : "Sign in" }
            </SubmitButton>
          </div>

          <div className="relative my-4">
            <Separator/>
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground whitespace-nowrap">
              or continue with
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <SubmitButton
              formAction={ clientActionMagicLink }
              variant="outline"
              className="flex items-center justify-center gap-2"
              formNoValidate
            >
              <Sparkles className="h-4 w-4"/>
              Sign in with Magic Link
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}