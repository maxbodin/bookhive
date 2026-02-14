"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";

/**
 *
 * @param formData
 */
export async function login( formData: FormData ) {
  const supabase = await createClient();

  const email = formData.get( "email" ) as string;
  const password = formData.get( "password" ) as string;

  const { error } = await supabase.auth.signInWithPassword( {
    email: email,
    password: password,
  } );

  if (error) {
    return { error: error.message };
  }

  revalidatePath( "/", "layout" );
  redirect( "/" );
}

/**
 *
 * @param formData
 */
export async function signup( formData: FormData ) {
  const supabase = await createClient();
  const origin = ( await headers() ).get( "origin" );

  const email = formData.get( "email" ) as string;
  const password = formData.get( "password" ) as string;

  const { error } = await supabase.auth.signUp( {
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${ origin }${ email }`,
    },
  } );

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email to verify your account." };
}

/**
 *
 * @param formData
 */
export async function signInWithOtp( formData: FormData ) {
  const supabase = await createClient();
  const origin = ( await headers() ).get( "origin" );

  const email = formData.get( "email" ) as string;

  const { error } = await supabase.auth.signInWithOtp( {
    email: email,
    options: {
      emailRedirectTo: `${ origin }${ email }`,
    },
  } );

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for the magic link." };
}

/**
 *
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath( "/", "layout" );
  redirect( "/" );
}