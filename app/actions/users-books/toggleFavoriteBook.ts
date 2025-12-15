"use server";

import { createClient } from "@/app/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

const MAX_FAVORITES = 4;

/**
 * Ajoute ou supprime un livre des favoris d'un utilisateur.
 * @param bookId
 * @param currentIsFavorite
 */
export async function toggleFavoriteBook( bookId: number, currentIsFavorite: boolean ) {
  const t = await getTranslations( "ToggleFavoriteBookAction" );
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: t( "authRequired" ) };
  }

  // Si l'utilisateur retire un favori.
  if (currentIsFavorite) {
    const { error } = await supabase
      .from( "users_books" )
      .update( { is_favorite: false } )
      .match( { uid: user.id, book_id: bookId } );

    if (error) return { success: false, message: t( "removeFavoriteFailed" ) };

  } else {
    // Si l'utilisateur ajoute un favori.

    // Vérifier que le livre est bien dans l'état "Lu".
    const { data: bookRecord, error: fetchError } = await supabase
      .from( "users_books" )
      .select( "state" )
      .match( { uid: user.id, book_id: bookId } )
      .single();

    if (fetchError || bookRecord?.state !== "read") {
      return { success: false, message: t( "onlyReadCanBeFavorite" ) };
    }

    // Vérifier que l'utilisateur n'a pas dépassé la limite.
    const { count, error: countError } = await supabase
      .from( "users_books" )
      .select( "*", { count: "exact", head: true } )
      .match( { uid: user.id, is_favorite: true } );

    if (countError) return { success: false, message: t( "checkFavoritesError" ) };
    if (count !== null && count >= MAX_FAVORITES) {
      return { success: false, message: t( "limitReached", { max: MAX_FAVORITES } ) };
    }

    // Mise à jour du livre comme favori.
    const { error: updateError } = await supabase
      .from( "users_books" )
      .update( { is_favorite: true } )
      .match( { uid: user.id, book_id: bookId } );

    if (updateError) return { success: false, message: t( "addFavoriteFailed" ) };
  }

  // Revalider la page de profil pour afficher instantanément le changement.
  if (user.email) {
    revalidatePath( `/${ encodeURIComponent( user.email ) }` );
  }

  return { success: true, message: t( "updateSuccess" ) };
}