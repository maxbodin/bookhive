import React, { useActionState, useEffect, useState } from "react";
import { ActionState } from "@/app/types/action-state";
import { forgotPassword, login, signup } from "@/app/login/actions";
import passwordStrength from "@/lib/passwordStrength";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOff, MailIcon } from "lucide-react";
import PasswordStrengthMeter from "@/components/login/password-strength-meter";
import SubmitButton from "@/components/login/submit-button";
import { useTranslations } from "next-intl";

const initialState: ActionState = { success: false };

export default function AuthFormContent( {
                                           mode,
                                           setMode,
                                         }: {
  mode: "signin" | "signup" | "forgot_password";
  setMode: ( mode: "signin" | "signup" | "forgot_password" ) => void;
} ) {
  const t = useTranslations( "AuthForm" );
  const [showPassword, setShowPassword] = useState<boolean>( false );
  const [passwordInput, setPasswordInput] = useState<string>( "" );
  const [errors, setErrors] = useState<ActionState["errors"]>( {} );

  let action = login;
  if (mode === "signup") action = signup;
  if (mode === "forgot_password") action = forgotPassword;

  const [state, formAction] = useActionState( action, initialState );
  const passwordScore: number = passwordStrength( passwordInput );

  useEffect( () => {
    if (state.errors) setErrors( ( prev ) => ( { ...prev, ...state.errors } ) );
  }, [state.errors] );

  useEffect( () => {
    if (state.success && state.message) {
      toast.success( state.message );
    } else
      if (!state.success && state.errors?.form) {
        toast.error( state.errors.form );
      }
  }, [state] );

  const handleSignupSubmit = ( formData: FormData ) => {
    if (passwordScore < 4) {
      toast.error( t( "error_password_weak" ) );
      return;
    }
    formAction( formData );
  };

  const handleSubmit = mode === "signup" ? handleSignupSubmit : formAction;

  /**
   * Helper to clear errors when user types.
   * @param field
   */
  const clearFieldError = ( field: keyof NonNullable<ActionState["errors"]> ) => {
    setErrors( ( prev ) => {
      if (!prev || !prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    } );
  };

  return (
    <>
      <form action={ handleSubmit } className="space-y-4">
        <Field>
          <FieldLabel htmlFor="email">{ t( "email_label" ) }</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              name="email"
              type="email"
              placeholder={ t( "email_placeholder" ) }
              required
              onChange={ () => clearFieldError( "email" ) }
            />
            <InputGroupAddon>
              <MailIcon className="h-4 w-4 text-muted-foreground"/>
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={ errors?.email ? [{ message: errors.email }] : [] }/>
        </Field>

        {/* Password field is hidden in forgot_password mode. */ }
        { mode !== "forgot_password" && (
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">{ t( "password_label" ) }</FieldLabel>
              { mode === "signin" && (
                <button
                  type="button"
                  onClick={ () => setMode( "forgot_password" ) }
                  className="text-xs text-muted-foreground hover:underline"
                >
                  { t( "forgot_password_link" ) }
                </button>
              ) }
            </div>
            <InputGroup>
              <InputGroupInput
                id="password"
                name="password"
                value={ passwordInput }
                onChange={ ( e ) => {
                  setPasswordInput( e.target.value );
                  clearFieldError( "password" );
                } }
                type={ showPassword ? "text" : "password" }
                placeholder={ t( "password_placeholder" ) }
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
                  { showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/> }
                </button>
              </InputGroupAddon>
            </InputGroup>
            <FieldError errors={ errors?.password ? [{ message: errors.password }] : [] }/>
          </Field>
        ) }

        { mode === "signup" && <PasswordStrengthMeter passwordScore={ passwordScore }/> }

        <div className="pt-2">
          <SubmitButton>
            { mode === "signup"
              ? t( "submit_signup" )
              : mode === "forgot_password"
                ? t( "submit_recovery" )
                : t( "submit_signin" ) }
          </SubmitButton>
        </div>
      </form>

      {/* Back to sign in button for forgot password mode. */ }
      { mode === "forgot_password" && (
        <button
          type="button"
          onClick={ () => setMode( "signin" ) }
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:underline"
        >
          { t( "back_to_signin" ) }
        </button>
      ) }
    </>
  );
}