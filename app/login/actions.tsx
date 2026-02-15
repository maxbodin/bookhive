"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import passwordStrength from "@/lib/passwordStrength";
import { ActionState } from "@/app/types/action-state";

/**
 * Logs in a user with email and password.
 * @param _prevState - The previous state (unused, but required for useFormState).
 * @param formData - The form data containing email and password.
 */
export async function login(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get( "email" ) as string;
  const password = formData.get( "password" ) as string;
  const errors: ActionState["errors"] = {};

  if (!email) {
    errors.email = "Email is required.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys( errors ).length > 0) {
    return { success: false, errors };
  }

  const { error } = await supabase.auth.signInWithPassword( {
    email: email,
    password: password,
  } );

  if (error) {
    return {
      success: false,
      errors: { form: "Invalid email or password. Please try again." },
    };
  }

  revalidatePath( "/", "layout" );
  redirect( "/" );
}

/**
 * Signs up a new user.
 * @param _prevState - The previous state.
 * @param formData - The form data containing email and password.
 */
export async function signup(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const origin = ( await headers() ).get( "origin" );

  const email = formData.get( "email" ) as string;
  const password = formData.get( "password" ) as string;
  const errors: ActionState["errors"] = {};

  if (!email) {
    errors.email = "Email is required.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else
    if (passwordStrength( password ) < 4) {
      errors.password = "Password is not strong enough.";
    }

  if (Object.keys( errors ).length > 0) {
    return { success: false, errors };
  }

  const { error } = await supabase.auth.signUp( {
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${ origin }${ email }`,
    },
  } );

  if (error) {
    return {
      success: false,
      errors: { form: error.message },
    };
  }

  return { success: true, message: "Check your email to verify your account." };
}

/**
 * Sends a magic link for signing in.
 * @param _prevState - The previous state.
 * @param formData - The form data containing the email.
 */
export async function signInWithOtp(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const origin = ( await headers() ).get( "origin" );

  const email = formData.get( "email" ) as string;

  if (!email) {
    return { success: false, errors: { email: "Email is required." } };
  }

  const { error } = await supabase.auth.signInWithOtp( {
    email: email,
    options: {
      emailRedirectTo: `${ origin }${ email }`,
    },
  } );

  if (error) {
    return {
      success: false,
      errors: { form: error.message },
    };
  }

  return { success: true, message: "Check your email for the magic link." };
}

/**
 * Signs out the current user.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath( "/", "layout" );
  redirect( "/" );
}