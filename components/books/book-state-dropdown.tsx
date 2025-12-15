"use client";

import React, { forwardRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookCheck, Bookmark, BookOpen, BookPlus, Check, ChevronDown, Heart, Trash2 } from "lucide-react";
import { BookState } from "@/app/types/book-state";
import { UserBook } from "@/app/types/user-book";
import { BookStateDateTimeDialog } from "@/components/books/book-state-date-time-dialog";
import { upsertBookState } from "@/app/actions/users-books/upsertBookState";
import { useTranslations } from "next-intl";

const states: BookState[] = ["reading", "read", "later", "wishlist"];

const stateIcons: Record<BookState, React.ElementType> = {
  reading: BookOpen,
  read: BookCheck,
  later: Bookmark,
  wishlist: Heart,
};

interface BookStateDropdownProps {
  bookId: number;
  currentStateRecord?: UserBook;
}

export function BookStateDropdown( { bookId, currentStateRecord }: BookStateDropdownProps ) {
  const t = useTranslations( "BookStateDropdown" );
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useState( currentStateRecord?.state );
  const [dialog, setDialog] = useState<{
    config: typeof DIALOG_CONFIG[keyof typeof DIALOG_CONFIG];
    newState: BookState
  } | null>( null );

  // Configuration for dialogs triggered by state changes.
  const DIALOG_CONFIG = {
    reading: {
      title: t( "dialogs.reading.title" ),
      description: t( "dialogs.reading.description" ),
      column: "start_reading_date"
    },
    read_from_reading: {
      title: t( "dialogs.read_from_reading.title" ),
      description: t( "dialogs.read_from_reading.description" ),
      column: "end_reading_date"
    },
    read: { title: t( "dialogs.read.title" ), description: t( "dialogs.read.description" ), column: "read_date" },
    wishlist: {
      title: t( "dialogs.wishlist.title" ),
      description: t( "dialogs.wishlist.description" ),
      column: "start_wishlist_date"
    },
    later: {
      title: t( "dialogs.later.title" ),
      description: t( "dialogs.later.description" ),
      column: "start_later_date"
    },
  };

  const stateLabels: Record<BookState, string> = {
    reading: t( "states.reading" ),
    read: t( "states.read" ),
    later: t( "states.later" ),
    wishlist: t( "states.wishlist" ),
  };

  /**
   *
   * @param newState
   */
  const handleStateChange = ( newState: BookState | null ) => {
    // If removing the current book state.
    if (newState === null) {
      return runUpsert( null, {
        end_reading_date: optimisticState === "reading" ? new Date().toISOString() : null,
        end_wishlist_date: optimisticState === "wishlist" ? new Date().toISOString() : null,
        end_later_date: optimisticState === "later" ? new Date().toISOString() : null,
      } );
    }

    // Determine if a dialog is needed.
    let dialogKey: keyof typeof DIALOG_CONFIG | null;

    const dialogMap = {
      reading: "reading",
      read: optimisticState === "reading" ? "read_from_reading" : "read",
      wishlist: "wishlist",
      later: "later",
    } as const;

    dialogKey = dialogMap[newState];

    if (dialogKey) {
      setDialog( { config: DIALOG_CONFIG[dialogKey], newState } );
    } else {
      // No dialog needed, but we might need to set an 'end' date automatically.
      const updates = {
        end_wishlist_date: optimisticState === "wishlist" ? new Date().toISOString() : currentStateRecord?.end_wishlist_date,
        end_later_date: optimisticState === "later" ? new Date().toISOString() : currentStateRecord?.end_later_date,
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
        const message = newState ? t( "toast.successMove", { state: stateLabels[newState] } ) : t( "toast.successRemove" );
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
      end_wishlist_date: optimisticState === "wishlist" ? new Date().toISOString() : currentStateRecord?.end_wishlist_date,
      end_later_date: optimisticState === "later" ? new Date().toISOString() : currentStateRecord?.end_later_date,
    };

    runUpsert( newState, updates );
  };

  const TriggerButton = forwardRef<HTMLButtonElement>( ( props, ref ) => {
    if (optimisticState) {
      const Icon = stateIcons[optimisticState];
      return (
        <Button
          ref={ ref }
          { ...props }
          variant="outline"
          size="sm"
          className="w-full text-xs"
          disabled={ isPending }
        >
          <Icon className="w-4 h-4 mr-2"/>
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
        { t( "addToShelf" ) }
      </Button>
    );
  } );

  TriggerButton.displayName = "TriggerButton";

  return (
    <>
      <DropdownMenu modal={ false }>
        <DropdownMenuTrigger asChild>
          <TriggerButton/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          { states.map( ( state ) => {
            const Icon = stateIcons[state];
            return (
              <DropdownMenuItem
                key={ state }
                onSelect={ () => handleStateChange( state ) }
                disabled={ isPending }
              >
                <Icon className="w-4 h-4 mr-2"/>
                { stateLabels[state] }
                { optimisticState === state && <Check className="w-4 h-4 ml-auto"/> }
              </DropdownMenuItem>
            );
          } ) }
          { optimisticState && (
            <>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onSelect={ () => handleStateChange( null ) } disabled={ isPending }
                                className="text-red-500">
                <Trash2 className="w-4 h-4 mr-2"/>
                { t( "removeFromShelf" ) }
              </DropdownMenuItem>
            </>
          ) }
        </DropdownMenuContent>
      </DropdownMenu>

      { dialog && (
        <BookStateDateTimeDialog
          isOpen={ !!dialog }
          onCloseAction={ () => setDialog( null ) }
          onSubmitAction={ handleDialogSubmit }
          title={ dialog.config.title }
          description={ dialog.config.description }
          isSubmitting={ isPending }
        />
      ) }
    </>
  );
}