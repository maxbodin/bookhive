import { UserBook } from "@/app/types/user-book";
import { BookPosterCard } from "@/components/books/book-poster-card";
import React from "react";

interface FavoriteBookshelfProps {
  favoriteUserBooks: UserBook[];  // The profile owner's favorite books
  isOwner: boolean;
  connectedUserBooks: UserBook[]; // The logged-in user's data with books
}

export function FavoriteBookshelf( { favoriteUserBooks, isOwner, connectedUserBooks }: FavoriteBookshelfProps ) {
  if (favoriteUserBooks.length === 0 && !isOwner) {
    return null;
  }

  return (
    <section className="mt-4 mb-8">
      <h2 className="text-2xl font-bold mb-4 border-b pb-4">Favorites</h2>
      { favoriteUserBooks.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          { favoriteUserBooks.map( ( profileFavoriteBook ) => {
            // For each favorite book of the profile owner, find the corresponding record
            // in the connected user's library.
            const connectedUserBook = connectedUserBooks.find( b => b.book_id === profileFavoriteBook.book_id );

            return (
              <BookPosterCard
                key={ profileFavoriteBook.id }
                book={ profileFavoriteBook }              // The base book data
                profileUserBook={ profileFavoriteBook }   // The profile owner's data for this book
                connectedUserBook={ connectedUserBook }   // The connected user's data for this book
                isOwner={ isOwner }
                inFavoriteSection={ true }
              />
            );
          } ) }
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-8 border-2 border-dashed border-primary rounded-lg">
          <h3 className="text-xl mb-2 tracking-tight">Aucun livre favori sélectionné.</h3>
          { isOwner &&
            <p className="text-muted-foreground text-sm mt-1">Cliquez sur l'étoile sur un livre "Lu" pour l'ajouter
              au favoris.</p> }
        </div>
      ) }
    </section>
  );
}