"use client";

import React, { useMemo, useState, useTransition } from "react";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "@/components/books/date-time-picker";
import { getBooksInReadingState } from "@/app/actions/getBooksInReadingState";
import { logReadingSession } from "@/app/actions/logReadingSession";
import { Spinner } from "@/components/ui/spinner";
import { UserBook } from "@/app/types/user-book";

const sessionSchema = z.object( {
  bookId: z.string().min( 1, "Please select a book." ),
  startDate: z.date( { error: "Please select a start time." } ),
  endDate: z.date( { error: "Please select an end time." } ),
  endPage: z.number().min( 0 ),
  startPage: z.number().min( 0 ),
  notes: z.string().max( 1000, "Notes are too long." ).optional(),
} ).refine( data => data.endDate > data.startDate, {
  message: "End time must be after start time.",
  path: ["endDate"],
} );

/**
 * Dialog component for logging reading sessions.
 */
export default function ReadingLogger() {
  const [isOpen, setIsOpen] = useState<boolean>( false );
  const [isFetchingBooks, startFetchingBooks] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const [books, setBooks] = useState<UserBook[]>( [] );

  // Form state is grouped for clarity
  const [formState, setFormState] = useState( {
    selectedBookId: undefined as string | undefined,
    startDate: new Date(),
    endDate: new Date(),
    endPage: 0,
    notes: "",
  } );

  // Memoize the selected book object to avoid re-calculating on every render.
  const selectedBook = useMemo(
    () => books.find( ( b ) => b.book_id.toString() === formState.selectedBookId ),
    [books, formState.selectedBookId]
  );

  // Memoize session stats for performance
  const sessionStats = useMemo( () => {
    if (!selectedBook) return { pagesRead: 0, progress: 0 };
    const pagesRead = formState.endPage - selectedBook.current_page;
    const progress = selectedBook.pages ?? 0 > 0
      ? Math.min( 100, Math.round( ( formState.endPage / ( selectedBook.pages ?? 0 ) ) * 100 ) )
      : 0;
    return { pagesRead, progress };
  }, [selectedBook, formState.endPage] );

  /**
   * Resets the form to its initial state.
   */
  const resetForm = () => {
    const now = new Date();
    const thirtyMinsAgo = new Date( now.getTime() - 30 * 60000 );
    setFormState( {
      selectedBookId: undefined,
      startDate: thirtyMinsAgo,
      endDate: now,
      endPage: 0,
      notes: "",
    } );
  };

  /**
   * Handles dialog open/close state changes.
   * @param open
   */
  const handleOpenChange = ( open: boolean ) => {
    setIsOpen( open );
    if (open) {
      resetForm();
      startFetchingBooks( async () => {
        const result = await getBooksInReadingState();
        if (result.error) {
          toast.error( result.error );
          setBooks( [] );
        } else {
          setBooks( result.data ?? [] );
        }
      } );
    }
  };

  /**
   * Handles book selection from the dropdown.
   * @param bookId - The value from the SelectItem, which is a string.
   */
  const handleBookSelect = ( bookId: string ) => {
    const book = books.find((b) => b.book_id.toString() === bookId);
    setFormState(prev => ({
      ...prev,
      selectedBookId: bookId,
      endPage: book?.current_page ?? 0,
    }));
  };

  /**
   * Handles form submission.
   */
  const handleSubmit = () => {
    const validation = sessionSchema.safeParse( {
      ...formState,
      bookId: formState.selectedBookId,
      startPage: selectedBook?.current_page ?? 0,
    } );

    if (!validation.success) {
      toast.error(validation.error.message || "Invalid input. Please check the form.");
      return;
    }

    const formData = new FormData();
    formData.append( "bookId", validation.data.bookId );
    formData.append( "startTime", validation.data.startDate.toISOString() );
    formData.append( "endTime", validation.data.endDate.toISOString() );
    formData.append( "endPage", validation.data.endPage.toString() );
    formData.append( "startPage", validation.data.startPage.toString() );
    formData.append( "notes", validation.data.notes ?? "" );

    console.log( JSON.stringify(formData ) );

    startSubmitting( async () => {
      const result = await logReadingSession( formData );
      if (result.success) {
        toast.success( result.message );
        setIsOpen( false );
      } else {
        toast.error( result.message );
      }
    } );
  };

  return (
    <Dialog open={ isOpen } onOpenChange={ handleOpenChange }>
      <DialogTrigger asChild>

        <Button
          className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50 hover:scale-105 transition-transform">
          <BookOpen className="h-8 w-8"/>
          <span className="sr-only">Log Reading</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Reading Session</DialogTitle>
          <DialogDescription>Record your progress. Keep the streak alive!</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <FormRow label="Book">
            <Select onValueChange={ handleBookSelect } value={ formState.selectedBookId } disabled={ isFetchingBooks }>
              <SelectTrigger>
                <SelectValue placeholder={ isFetchingBooks ? "Loading books..." : "Select a book..." }/>
              </SelectTrigger>
              <SelectContent>
                { !isFetchingBooks && books.length === 0 && (
                  <p className="p-4 text-sm text-center text-muted-foreground">No books in "Reading" state.</p>
                ) }
                { books.map( ( book ) => (
                  <SelectItem key={ book.book_id }
                              value={ book.book_id.toString() }>{ book.title }</SelectItem>
                ) ) }
              </SelectContent>
            </Select>
          </FormRow>

          <FormRow label="Start Time">
            <DateTimePicker date={ formState.startDate }
                            setDateAction={ ( date ) => setFormState( p => ( { ...p, startDate: date! } ) ) }
                            disabled={ isSubmitting }/>
          </FormRow>

          <FormRow label="End Time">
            <DateTimePicker date={ formState.endDate }
                            setDateAction={ ( date ) => setFormState( p => ( { ...p, endDate: date! } ) ) }
                            disabled={ isSubmitting }/>
          </FormRow>

          <FormRow label="Stopped at">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={ formState.endPage }
                onChange={ ( e ) => setFormState( p => ( { ...p, endPage: Number( e.target.value ) } ) ) }
                className="w-24"
                min={ selectedBook?.current_page ?? 0 }
                max={ selectedBook?.pages ?? 0 }
                disabled={ !selectedBook || isSubmitting }
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                                / { selectedBook?.pages ?? "--" } pages
                            </span>
            </div>
          </FormRow>

          <div className={ cn(
            "transition-opacity duration-300",
            !selectedBook ? "opacity-0 invisible h-0" : "opacity-100"
          ) }>
            <div className="bg-muted/50 p-3 rounded-md text-sm grid grid-cols-2 gap-2 border">
              <StatBox label="This Session"
                       value={ `${ sessionStats.pagesRead > 0 ? "+" : "" }${ sessionStats.pagesRead } pages` }
                       positive={ sessionStats.pagesRead > 0 }/>
              <StatBox label="Total Progress" value={ `${ sessionStats.progress }% complete` }/>
            </div>
          </div>

          <FormRow label="Notes">
            <Textarea
              className="col-span-3 resize-none"
              placeholder="What happened in this session?"
              value={ formState.notes }
              onChange={ ( e ) => setFormState( p => ( { ...p, notes: e.target.value } ) ) }
              disabled={ isSubmitting }
            />
          </FormRow>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={ handleSubmit } disabled={ isSubmitting || !formState.selectedBookId }>
            { isSubmitting && <Spinner/> }
            Save Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Reusable form row component with a label and content.
 * @param label
 * @param children
 * @constructor
 */
const FormRow = ( { label, children }: { label: string; children: React.ReactNode } ) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label className="text-right">{ label }</Label>
    <div className="col-span-3">{ children }</div>
  </div>
);

/**
 * Stat box component for displaying a label and value.
 * @param label
 * @param value
 * @param positive
 * @constructor
 */
const StatBox = ( { label, value, positive = false }: { label: string; value: string; positive?: boolean } ) => (
  <div>
    <span className="block text-muted-foreground text-xs uppercase tracking-wider">{ label }</span>
    <span className={ cn( "font-medium", positive && "text-green-600" ) }>{ value }</span>
  </div>
);