"use client";

import { forwardRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookPlus, Check, ChevronDown } from "lucide-react";
import { upsertBookState } from "@/app/services/users-books";
import { BookState } from "@/app/types/book-state";

const states: BookState[] = ["reading", "read", "later", "wishlist"];
const stateLabels: Record<BookState, string> = {
  reading: "Reading",
  read: "Read",
  later: "Read Later",
  wishlist: "Wishlist",
};

interface BookStateDropdownProps {
  bookId: number;
  currentState?: BookState;
}

export function BookStateDropdown( { bookId, currentState }: BookStateDropdownProps ) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useState( currentState );

  const handleStateChange = ( newState: BookState ) => {
    startTransition( async () => {
      setOptimisticState( newState );
      const result = await upsertBookState( bookId, newState );
      if (result?.error) {
        toast.error( result.error );
        setOptimisticState( currentState );
      } else {
        toast.success( `Book moved to "${ stateLabels[newState] }"` );
      }
    } );
  };

  const TriggerButton = forwardRef<HTMLButtonElement>( ( props, ref ) => {
    if (optimisticState) {
      return (
        <Button
          ref={ ref }
          { ...props }
          variant="outline"
          size="sm"
          className="w-full text-xs"
          disabled={ isPending }
        >
          <Check className="w-4 h-4 mr-2"/>
          { stateLabels[optimisticState] }
          <ChevronDown className="w-4 h-4 ml-auto"/>
        </Button>
      );
    }
    return (
      <Button
        ref={ ref }
        { ...props }
        variant="secondary"
        size="sm"
        className="w-full text-xs"
        disabled={ isPending }
      >
        <BookPlus className="w-4 h-4 mr-2"/>
        Add to Shelf
      </Button>
    );
  } );

  TriggerButton.displayName = "TriggerButton";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        { states.map( ( state ) => (
          <DropdownMenuItem
            key={ state }
            onSelect={ () => handleStateChange( state ) }
            disabled={ isPending }
          >
            { stateLabels[state] }
            { optimisticState === state && <Check className="w-4 h-4 ml-auto"/> }
          </DropdownMenuItem>
        ) ) }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}