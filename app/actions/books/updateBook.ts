"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { BookType } from "@/app/types/book";
import { getTranslations } from "next-intl/server";

export async function updateBook( bookId: number, formData: FormData ) {
  const t = await getTranslations( "ServerActions.updateBook" );
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return { success: false, message: t( "unauthorized" ) };
  }

  const profile = await getUserProfile( currentUser.email );
  if (!profile?.is_admin) {
    return { success: false, message: t( "adminOnly" ) };
  }

  const parseArray = ( val: FormDataEntryValue | null ) =>
    val ? val.toString().split( "," ).map( s => s.trim() ).filter( Boolean ) : null;

  const dataToUpdate = {
    title: formData.get( "title" )?.toString() || null,
    description: formData.get( "description" )?.toString() || null,
    publisher: formData.get( "publisher" )?.toString() || null,
    publication_date: formData.get( "publication_date" )?.toString() || null,
    isbn_10: formData.get( "isbn_10" )?.toString() || null,
    isbn_13: formData.get( "isbn_13" )?.toString() || null,
    cover_url: formData.get( "cover_url" )?.toString() || null,
    type: ( formData.get( "type" )?.toString() as BookType ) || null,
    authors: parseArray( formData.get( "authors" ) ),
    categories: parseArray( formData.get( "categories" ) ),
    pages: Number( formData.get( "pages" ) ) || null,
    height: Number( formData.get( "height" ) ) || 0,
    length: Number( formData.get( "length" ) ) || 0,
    width: Number( formData.get( "width" ) ) || 0,
    weight: Number( formData.get( "weight" ) ) || null,
  };

  const { error } = await supabase
    .from( "books" )
    .update( dataToUpdate )
    .eq( "id", bookId );

  if (error) {
    console.error( "Update book error:", error.message );
    return { success: false, message: t( "error" ) };
  }

  revalidatePath( "/" );

  return { success: true, message: t( "success" ) };
}