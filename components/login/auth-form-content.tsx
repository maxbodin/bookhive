import React, { useEffect, useState } from "react";
import { ActionState } from "@/app/types/action-state";
import { login, signInWithOtp, signup } from "@/app/login/actions";
import { useFormState } from "react-dom";
import passwordStrength from "@/lib/passwordStrength";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOff, MailIcon, Sparkles } from "lucide-react";
import PasswordStrengthMeter from "@/components/login/password-strength-meter";
import SubmitButton from "@/components/login/submit-button";
import { Separator } from "@/components/ui/separator";

const initialState: ActionState = { success: false };

export default function AuthFormContent( { mode }: { mode: "signin" | "signup" } ) {
  const [showPassword, setShowPassword] = useState<boolean>( false );
  const [passwordInput, setPasswordInput] = useState<string>( "" );
  const [errors, setErrors] = useState<ActionState["errors"]>( {} );

  const action = mode === "signin" ? login : signup;

  const [state, formAction] = useFormState( action, initialState );
  const [otpState, otpAction] = useFormState( signInWithOtp, initialState );

  const passwordScore: number = passwordStrength( passwordInput );

  useEffect( () => {
    if (state.errors) {
      setErrors( ( prev ) => ( { ...prev, ...state.errors } ) );
    }
  }, [state.errors] );

  useEffect( () => {
    if (otpState.errors) {
      setErrors( ( prev ) => ( { ...prev, ...otpState.errors } ) );
    }
  }, [otpState.errors] );

  useEffect( () => {
    if (state.success && state.message) {
      toast.success( state.message );
    } else
      if (!state.success && state.errors?.form) {
        toast.error( state.errors.form );
      }
  }, [state] );

  useEffect( () => {
    if (otpState.success && otpState.message) {
      toast.success( otpState.message );
    } else
      if (!otpState.success && otpState.errors?.form) {
        toast.error( otpState.errors.form );
      }
  }, [otpState] );

  const handleSignupSubmit = ( formData: FormData ) => {
    if (passwordScore < 4) {
      toast.error( "Password is not strong enough. Please choose a stronger one." );
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
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    } );
  };

  return (
    <>
      <form action={ handleSubmit } className="space-y-4">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={ () => clearFieldError( "email" ) }
            />
            <InputGroupAddon>
              <MailIcon className="h-4 w-4 text-muted-foreground"/>
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={ errors?.email ? [{ message: errors.email }] : [] }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
          <FieldError
            errors={ errors?.password ? [{ message: errors.password }] : [] }
          />
        </Field>

        { mode === "signup" && <PasswordStrengthMeter passwordScore={ passwordScore }/> }

        <div className="pt-2">
          <SubmitButton>
            { mode === "signup" ? "Create account" : "Sign in" }
          </SubmitButton>
        </div>
      </form>

      <div className="relative my-6">
        <Separator/>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground whitespace-nowrap">
          or continue with
        </div>
      </div>

      <form action={ otpAction } className="grid grid-cols-1 gap-3">
        <SubmitButton
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4"/>
          Sign in with Magic Link
        </SubmitButton>
      </form>
    </>
  );
}