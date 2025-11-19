/*
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";


export async function login( formData: FormData ) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get( "email" ) as string,
    password: formData.get( "password" ) as string,
  };

  console.log( data );

  const { error } = await supabase.auth.signInWithPassword( data );

  if (error) {
    console.error( error );
    redirect( "/error" );
  }

  revalidatePath( "/", "layout" );
  redirect( "/" );
}

export async function signup( formData: FormData ) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get( "email" ) as string,
    password: formData.get( "password" ) as string,
  };

  const { error } = await supabase.auth.signUp( data );

  if (error) {
    console.error( error );
    redirect( "/error" );
  }

  revalidatePath( "/", "layout" );
  redirect( "/" );
}

export async function signInWithEmail( formData: FormData ) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { data, error } = await supabase.auth.signInWithOtp( {
    email: formData.get( "email" ) as string,
    /!*    options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: false,
          emailRedirectTo: "https://example.com/welcome",
        },*!/
  } );

  if (error) {
    console.log( "Error sending magic link:", error );
    redirect( "/error" );
  }
}
*/
