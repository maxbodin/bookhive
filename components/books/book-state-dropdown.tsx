"use client";

import { forwardRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookPlus, Check, ChevronDown, Trash2 } from "lucide-react";
import { upsertBookState } from "@/app/services/users-books";
import { BookState } from "@/app/types/book-state";
import { DateTimePickerDialog } from "./date-time-picker-dialog";
import { UserBook } from "@/app/types/user-book";

// Configuration for dialogs triggered by state changes.
const DIALOG_CONFIG = {
  reading: { title: "Start Reading", description: "When did you start reading this book?", column: "start_reading_date" },
  read_from_reading: { title: "Finish Reading", description: "When did you finish this book?", column: "end_reading_date" },
  read: { title: "Add to Read", description: "When did you read this book?", column: "read_date" },
  wishlist: { title: "Add to Wishlist", description: "When did you add this to your wishlist?", column: "start_wishlist_date" },
  later: { title: "Add to Read Later", description: "When did you save this for later?", column: "start_later_date" },
};

const states: BookState[] = ["reading", "read", "later", "wishlist"];
const stateLabels: Record<BookState, string> = {
  reading: "Reading",
  read: "Read",
  later: "Read Later",
  wishlist: "Wishlist",
};

interface BookStateDropdownProps {
  bookId: number;
  currentStateRecord?: UserBook;
}

export function BookStateDropdown( { bookId, currentStateRecord }: BookStateDropdownProps ) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useState( currentStateRecord?.state );
  const [dialog, setDialog] = useState<{ config: typeof DIALOG_CONFIG[keyof typeof DIALOG_CONFIG]; newState: BookState } | null>( null );

  /**
   *
   * @param newState
   */
  const handleStateChange = ( newState: BookState | null ) => {
    // If removing the current book state.
    if (newState === null) {
      return runUpsert( null, {
        end_reading_date: optimisticState === 'reading' ? new Date().toISOString() : null,
        end_wishlist_date: optimisticState === 'wishlist' ? new Date().toISOString() : null,
        end_later_date: optimisticState === 'later' ? new Date().toISOString() : null,
      } );
    }

    // Determine if a dialog is needed.
    let dialogKey: keyof typeof DIALOG_CONFIG | null = null;

    if (newState === 'reading') dialogKey = 'reading';
    else if (newState === 'read' && optimisticState === 'reading') dialogKey = 'read_from_reading';
    else if (newState === 'read') dialogKey = 'read';
    else if (newState === 'wishlist') dialogKey = 'wishlist';
    else if (newState === 'later') dialogKey = 'later';

    if (dialogKey) {
      setDialog( { config: DIALOG_CONFIG[dialogKey], newState } );
    } else {
      // No dialog needed, but we might need to set an 'end' date automatically.
      const updates = {
        end_wishlist_date: optimisticState === 'wishlist' ? new Date().toISOString() : currentStateRecord?.end_wishlist_date,
        end_later_date: optimisticState === 'later' ? new Date().toISOString() : currentStateRecord?.end_later_date,
      };
      runUpsert( newState, updates );
    }
  };

  /**
   *
   * @param newState
   * @param updates
   */
  const runUpsert = ( newState: BookState | null, updates: Record<string, any> = {} ) => {
    startTransition( async () => {
      const originalState = optimisticState;
      setOptimisticState( newState ?? undefined );

      const result = await upsertBookState( bookId, newState, updates );

      if (result?.error) {
        toast.error( result.error );
        setOptimisticState( originalState ); // Revert on error.
      } else {
        const message = newState ? `Book moved to "${ stateLabels[newState] }"` : "Book removed from shelf";
        toast.success( message );
      }
      setDialog( null ); // Close dialog on success.
    } );
  };

  /**
   *
   * @param date
   */
  const handleDialogSubmit = ( date: string ) => {
    if (!dialog) return;
    const { config, newState } = dialog;

    const updates = {
      [config.column]: date,
      // When moving state, automatically close out the previous state's timeline.
      end_wishlist_date: optimisticState === 'wishlist' ? new Date().toISOString() : currentStateRecord?.end_wishlist_date,
      end_later_date: optimisticState === 'later' ? new Date().toISOString() : currentStateRecord?.end_later_date,
    };

    runUpsert( newState, updates );
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
    <>
      <DropdownMenu modal={false}>
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
          { optimisticState && (
            <>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onSelect={ () => handleStateChange( null ) } disabled={ isPending } className="text-red-500">
                <Trash2 className="w-4 h-4 mr-2"/>
                Remove from Shelf
              </DropdownMenuItem>
            </>
          ) }
        </DropdownMenuContent>
      </DropdownMenu>

      { dialog && (
        <DateTimePickerDialog
          isOpen={ !!dialog }
          onClose={ () => setDialog( null ) }
          onSubmit={ handleDialogSubmit }
          title={ dialog.config.title }
          description={ dialog.config.description }
          isSubmitting={ isPending }
        />
      ) }
    </>
  );
}