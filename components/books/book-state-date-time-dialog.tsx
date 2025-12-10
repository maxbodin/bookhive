"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/books/date-time-picker";

interface BookStateDateTimeDialogDialogProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSubmitAction: ( date: string ) => void;
  title: string;
  description: string;
  isSubmitting: boolean;
}

/**
 * A dialog component that allows users to select a date and time.
 * The state is managed here and passed down to the DateTimePicker.
 */
export function BookStateDateTimeDialog( {
                                           isOpen,
                                           onCloseAction,
                                           onSubmitAction,
                                           title,
                                           description,
                                           isSubmitting,
                                         }: BookStateDateTimeDialogDialogProps ) {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>( new Date() );

  // Reset the date to the current time whenever the dialog is opened.
  useEffect( () => {
    if (isOpen) {
      setSelectedDateTime( new Date() );
    }
  }, [isOpen] );

  const handleSubmit = ( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    if (!selectedDateTime) {
      toast.error( "Please select a valid date and time." );
      return;
    }
    // Submit the final combined date as a universal ISO string.
    onSubmitAction( selectedDateTime.toISOString() );
  };

  return (
    <Dialog open={ isOpen } onOpenChange={ ( open ) => !open && onCloseAction() }>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={ handleSubmit }>
          <DialogHeader className="mb-4">
            <DialogTitle>{ title }</DialogTitle>
            <DialogDescription>{ description }</DialogDescription>
          </DialogHeader>
          <DateTimePicker date={ selectedDateTime } setDateAction={ setSelectedDateTime }/>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className={ "m-2 sm:m-0" } disabled={ isSubmitting }>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={ isSubmitting || !selectedDateTime }>
              { isSubmitting ? <Spinner/> : "Save" }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}