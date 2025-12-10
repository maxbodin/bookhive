import { UserBook } from "@/app/types/user-book";
import { BookPosterCard } from "@/components/books/book-poster-card";
import React from "react";

interface FavoriteBookshelfProps {
  favoriteBooks: UserBook[];
  isOwner: boolean;
}

export function FavoriteBookshelf( { favoriteBooks, isOwner }: FavoriteBookshelfProps ) {
  // On n'affiche pas la section si elle est vide et que ce n'est pas le profil du propriétaire.
  if (favoriteBooks.length === 0 && !isOwner) {
    return null;
  }

  return (
    <section className="mt-4 mb-8">
      <h2 className="text-2xl font-bold mb-4 border-b pb-4">Favoris</h2>
      { favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          { favoriteBooks.map( ( book ) => (
            <BookPosterCard key={ book.id } book={ book } userBook={ book } isOwner={ isOwner } inFavoriteSection/>
          ) ) }
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