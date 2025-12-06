"use client";

import { FormEvent, useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface DateTimePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ( date: string ) => void;
  title: string;
  description: string;
  isSubmitting: boolean;
}

/**
 * A dialog component that allows users to select a date from a calendar
 * popover and a time from a dedicated input.
 */
export function DateTimePickerDialog( {
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        title,
                                        description,
                                        isSubmitting,
                                      }: DateTimePickerDialogProps ) {
  const [isPopoverOpen, setIsPopoverOpen] = useState( false );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>( new Date() );
  const [time, setTime] = useState<string>( "" );

  // Set the default time to the current time when the dialog opens
  useEffect( () => {
    if (isOpen) {
      const now = new Date();
      const hours = String( now.getHours() ).padStart( 2, "0" );
      const minutes = String( now.getMinutes() ).padStart( 2, "0" );
      setTime( `${ hours }:${ minutes }` );
      // Also reset the date to today, in case it was changed previously
      setSelectedDate(new Date());
    }
  }, [isOpen] );

  const handleSubmit = ( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    if (!selectedDate || !time) {
      toast.error( "Please select a valid date and time." );
      return;
    }

    // Clone the selected date to avoid mutating the state directly
    const combinedDateTime = new Date( selectedDate );

    // Parse the time string and set the hours and minutes on our date object
    const [hours, minutes] = time.split( ":" ).map( Number );
    combinedDateTime.setHours( hours, minutes, 0, 0 ); // Set seconds and ms to 0 for cleanliness

    // Submit the final combined date as a universal ISO string
    onSubmit( combinedDateTime.toISOString() );
  };

  return (
    <Dialog open={ isOpen } onOpenChange={ ( open ) => !open && onClose() }>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={ handleSubmit }>
          <DialogHeader>
            <DialogTitle>{ title }</DialogTitle>
            <DialogDescription>{ description }</DialogDescription>
          </DialogHeader>

          {/* New Date and Time Picker UI */}
          <div className="flex items-end gap-4 py-4">
            <div className="flex flex-col gap-2 flex-grow">
              <Label htmlFor="date-picker">
                Date
              </Label>
              <Popover open={ isPopoverOpen } onOpenChange={ setIsPopoverOpen } >
                <PopoverTrigger asChild >
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-full justify-between font-normal"
                  >
                    { selectedDate ? selectedDate.toLocaleDateString() : "Select date" }
                    <ChevronDownIcon className="h-4 w-4 text-muted-foreground"/>
                  </Button>
                </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start" >
                    <Calendar
                      mode="single"
                      selected={ selectedDate }
                      onSelect={ ( date ) => {
                        setSelectedDate( date );
                        setIsPopoverOpen( false );
                      } }
                      initialFocus
                    />
                  </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="time-picker">
                Time
              </Label>
              <Input
                id="time-picker"
                type="time"
                value={ time }
                onChange={ ( e ) => setTime( e.target.value ) }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className={"m-2 sm:m-0"}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={ isSubmitting }>
              { isSubmitting ? <Spinner/> : "Save" }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}