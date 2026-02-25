"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import PasswordStrengthMeter from "@/components/login/password-strength-meter";
import SubmitButton from "@/components/login/submit-button";
import { updatePassword } from "@/app/login/actions";
import { ActionState } from "@/app/types/action-state";
import passwordStrength from "@/lib/passwordStrength";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const initialState: ActionState = { success: false };

export default function ResetPasswordPage() {
  const t = useTranslations( "AuthForm" );
  const [showPassword, setShowPassword] = useState<boolean>( false );
  const [passwordInput, setPasswordInput] = useState<string>( "" );
  const [errors, setErrors] = useState<ActionState["errors"]>( {} );

  const [state, formAction] = useActionState( updatePassword, initialState );
  const passwordScore = passwordStrength( passwordInput );

  useEffect( () => {
    if (state.errors) setErrors( state.errors );
  }, [state.errors] );

  useEffect( () => {
    if (state.success) {
      toast.success( t( "success_password_updated" ) );
    } else
      if (state.errors?.form) {
        toast.error( state.errors.form );
      }
  }, [state] );

  const handleSubmit = ( formData: FormData ) => {
    if (passwordScore < 4) {
      toast.error( t( "error_password_weak" ) );
      return;
    }
    formAction( formData );
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <CardHeader className="text-left w-full px-8">
          <CardTitle className="text-2xl font-bold tracking-tight">{ t( "title_reset_password" ) }</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={ handleSubmit } className="space-y-4">
            <Field>
              <FieldLabel htmlFor="password">{ t( "new_password_label" ) }</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  value={ passwordInput }
                  onChange={ ( e ) => {
                    setPasswordInput( e.target.value );
                    setErrors( ( prev ) => ( { ...prev, password: undefined } ) );
                  } }
                  type={ showPassword ? "text" : "password" }
                  placeholder={ t( "password_placeholder" ) }
                  required
                  minLength={ 8 }
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

            <PasswordStrengthMeter passwordScore={ passwordScore }/>

            <div className="pt-2">
              <SubmitButton>{ t( "submit_reset_password" ) }</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}