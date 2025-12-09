"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavoriteBook } from "@/app/services/favorites";

interface FavoriteToggleButtonProps {
  bookId: number;
  isFavorite: boolean;
}

export function FavoriteToggleButton( { bookId, isFavorite }: FavoriteToggleButtonProps ) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition( async () => {
      const result = await toggleFavoriteBook( bookId, isFavorite );
      if (result.success) {
        toast.success( result.message );
      } else {
        toast.error( result.message );
      }
    } );
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={ handleClick }
      disabled={ isPending }
      className="absolute top-1 left-1 h-8 w-8 bg-black/30 hover:bg-black/50"
    >
      <Star className={ cn(
        "h-10 w-10 text-white transition-colors",
        isFavorite ? "fill-yellow-400 text-yellow-400" : "fill-transparent"
      ) }/>
      <span className="sr-only">{ isFavorite ? "Retirer des favoris" : "Ajouter aux favoris" }</span>
    </Button>
  );
}