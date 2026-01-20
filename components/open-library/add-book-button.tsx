"use client";
import { useTransition } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addBookFromOpenLibrary } from "@/app/actions/books/addBookFromOpenLibrary";

export function AddBookButton( { openLibraryKey }: { openLibraryKey: string } ) {
  const [isPending, startTransition] = useTransition();

  const handleAddBook = () => {
    startTransition( async () => {
      const result: { success: boolean, message: string } = await addBookFromOpenLibrary( openLibraryKey );
      if (result.success) {
        toast.success( result.message );
      } else {
        toast.error( result.message );
      }
    } );
  };

  // TODO : Add internalization.
  return (
    <Button
      variant="outline"
      onClick={ handleAddBook }
      disabled={ isPending }
    >
      <PlusCircle className="h-4 w-4 mr-2"/>
      { isPending ? "Adding..." : "Add book in library" }
    </Button>
  );
}