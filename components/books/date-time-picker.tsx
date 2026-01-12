"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  date: Date | undefined;
  setDateAction: ( date: Date | undefined ) => void;
  disabled?: boolean;
}

/**
 * Controlled component that allows users to select a date from a calendar
 * and a time from a time input.
 */
export function DateTimePicker( { date, setDateAction, disabled }: DateTimePickerProps ) {
  const t = useTranslations( "DateTimePicker" );
  const [isPopoverOpen, setIsPopoverOpen] = useState( false );

  const handleDateSelect = ( selectedDay: Date | undefined ) => {
    if (!selectedDay) {
      setDateAction( undefined );
      return;
    }
    const hours = date?.getHours() ?? 0;
    const minutes = date?.getMinutes() ?? 0;

    const newDate = new Date( selectedDay );
    newDate.setHours( hours, minutes, 0, 0 );

    setDateAction( newDate );
    setIsPopoverOpen( false );
  };

  const handleTimeChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    const timeValue = event.target.value;
    if (!date || !timeValue) return;

    const [hours, minutes] = timeValue.split( ":" ).map( Number );

    const newDate = new Date( date );
    newDate.setHours( hours, minutes, 0, 0 );

    setDateAction( newDate );
  };

  const timeValue = date ? format( date, "HH:mm" ) : "";

  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col gap-2 flex-grow">
        <Label htmlFor="date-picker">{ t( "dateLabel" ) }</Label>
        <Popover open={ isPopoverOpen } onOpenChange={ setIsPopoverOpen }>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className={ cn(
                "w-fit justify-between font-normal",
                !date && "text-muted-foreground"
              ) }
              disabled={ disabled }
            >
              <CalendarIcon className="mr-2 h-4 w-4"/>
              { date ? format( date, "PPP" ) : <span>{ t( "placeholder" ) }</span> }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={ date }
              onSelect={ handleDateSelect }
              autoFocus={ true }
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="time-picker">{ t( "timeLabel" ) }</Label>
        <Input
          id="time-picker"
          type="time"
          value={ timeValue }
          onChange={ handleTimeChange }
          disabled={ !date || disabled }
          required
        />
      </div>
    </div>
  );
}