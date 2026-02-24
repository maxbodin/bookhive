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
    <Button
      variant="secondary"
      onClick={ handleAddBook }
      disabled={ isPending }
      className="w-full h-auto min-h-8 text-sm whitespace-normal leading-tight flex items-center justify-center"
    >
      <PlusCircle className="h-3.5 w-3.5 shrink-0"/>
      <span className="text-center">{ isPending ? t( "adding" ) : t( "addBook" ) }</span>
    </Button>
  );
}