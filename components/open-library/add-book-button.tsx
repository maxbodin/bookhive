"use client";
import { Button } from "@/components/ui/button";
import { addBookFromOpenLibrary } from "@/app/actions/books/addBookFromOpenLibrary";
import { ActionState } from "@/app/types/action-state";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

export function AddBookButton( { openLibraryKey }: { openLibraryKey: string } ) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations( "AddBookButton" );

  const handleAddBook = () => {
    startTransition( async () => {
      const result: ActionState = await addBookFromOpenLibrary( openLibraryKey );
      if (result.success) {
        toast.success( result.message );
      } else {
        toast.error( result.message );
      }
    } );
  };

  return (
    <Button variant="outline" onClick={ handleAddBook } disabled={ isPending }>
      <PlusCircle className="mr-2 h-4 w-4"/>
      { isPending ? t( "adding" ) : t( "addBook" ) }
    </Button>
  );
}