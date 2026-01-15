"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ReadingSession } from "@/app/types/reading-session";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { processSessionsForCalendar } from "@/app/utils/profiles/processSessionsForCalendar";
import { format, getDay } from "date-fns";
import { cn } from "@/lib/utils";

interface ReadingActivityCalendarProps {
  readingSessions: ReadingSession[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ReadingActivityCalendar( { readingSessions }: ReadingActivityCalendarProps ) {
  const t = useTranslations( "ReadingActivityCalendar" );
  const activityByDate = useMemo( () => processSessionsForCalendar( readingSessions ), [readingSessions] );

  const availableYears = useMemo( () => {
    const years = new Set<string>();
    activityByDate.forEach( ( _, date ) => years.add( date.substring( 0, 4 ) ) );
    if (years.size === 0) {
      years.add( new Date().getFullYear().toString() );
    }
    return Array.from( years ).sort( ( a, b ) => Number( b ) - Number( a ) );
  }, [activityByDate] );

  const [selectedYear, setSelectedYear] = useState<string>( availableYears[0] );

  const { months } = useMemo( () => {
    const year = parseInt( selectedYear, 10 );
    const months = Array.from( { length: 12 }, ( _, monthIndex ) => {
      const firstDayOfMonth = new Date( year, monthIndex, 1 );
      const monthName = format( firstDayOfMonth, "MMMM" );
      const weeks = [];
      let currentWeek = new Array( 7 ).fill( null );
      let currentDate = new Date( firstDayOfMonth );

      while (currentDate.getMonth() === monthIndex) {
        const dayOfWeek = getDay( currentDate );
        const dateKey = format( currentDate, "yyyy-MM-dd" );

        currentWeek[dayOfWeek] = {
          key: dateKey,
          date: new Date( currentDate ),
          activity: activityByDate.get( dateKey ) || { count: 0, level: 0 },
        };

        if (dayOfWeek === 6) {
          weeks.push( currentWeek );
          currentWeek = new Array( 7 ).fill( null );
        }
        currentDate.setDate( currentDate.getDate() + 1 );
      }

      if (currentWeek.some( day => day !== null )) {
        weeks.push( currentWeek );
      }

      return { month: monthName, weeks };
    } );
    return { months };
  }, [selectedYear, activityByDate] );

  const getBackgroundColorStyle = ( level: 0 | 1 | 2 | 3 | 4 ) => {
    if (level === 0) return {};
    const lightness = ( level * 15 );
    return { backgroundColor: `hsl(47.9 95.8% ${ lightness }%)` };
  };

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-sm">{ t( "title" ) }</h3>

        {/* Year selection */ }
        <Select value={ selectedYear } onValueChange={ setSelectedYear }>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder={ t( "yearPlaceholder" ) }/>
          </SelectTrigger>
          <SelectContent>
            { availableYears.map( year => (
              <SelectItem key={ year } value={ year } className="text-xs">
                { year }
              </SelectItem>
            ) ) }
          </SelectContent>
        </Select>
      </div>

      {/* Weekdays */ }
      <div className="flex gap-3">
        <div className="text-xs text-muted-foreground pr-2 mt-1">
          <div className="h-6"></div>
          <div className="flex flex-col gap-1">
            { WEEKDAYS.map( ( day, index ) => (
              <span key={ index } className="h-4 w-8 flex items-center">
                { day }
              </span>
            ) ) }
          </div>
        </div>

        {/* Scrollable container for the calendar grid. */ }
        <div className="overflow-x-auto pb-4">
          <div className="flex">
            <TooltipProvider delayDuration={ 10 }>
              { months.map( ( { month, weeks }, monthIndex ) => (
                <div key={ month } className={ cn( monthIndex > 0 && "pl-4" ) }>
                  <div className="text-xs text-muted-foreground h-6 flex items-center mb-1">
                    { month }
                  </div>
                  {/* Grid for this month */ }
                  <div className="flex gap-1">
                    { weeks.map( ( week, weekIndex ) => (
                      <div key={ weekIndex } className="flex flex-col gap-1">
                        { week.map( ( day, dayIndex ) => {
                          if (!day) {
                            return <div key={ `pad-${ monthIndex }-${ weekIndex }-${ dayIndex }` }
                                        className="h-4 w-4"/>;
                          }
                          return (
                            <Tooltip key={ day.key }>
                              <TooltipTrigger asChild>
                                <div
                                  className={ cn(
                                    "h-4 w-4 rounded-sm",
                                    day.activity.level === 0 && "bg-muted/50"
                                  ) }
                                  style={ getBackgroundColorStyle( day.activity.level ) }
                                />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                <p>
                                  { day.activity.count > 0
                                    ? t( "tooltip.activity", { count: day.activity.count } )
                                    : t( "tooltip.noActivity" ) }{ " " }
                                  { format( day.date, "MMM d, yyyy" ) }
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        } ) }
                      </div>
                    ) ) }
                  </div>
                </div>
              ) ) }
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}