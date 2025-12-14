"use client";

import { useMemo, useState } from "react";
import { ReadingSession } from "@/app/types/reading-session";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { processSessionsForCalendar } from "@/app/utils/profiles/processSessionsForCalendar";
import { format, getDay } from "date-fns";
import { cn } from "@/lib/utils";

interface ReadingActivityCalendarProps {
  readingSessions: ReadingSession[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ReadingActivityCalendar( { readingSessions }: ReadingActivityCalendarProps ) {
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

  const { weeks, monthsByWeek } = useMemo( () => {
    const year = parseInt( selectedYear, 10 );
    const firstDayOfYear = new Date( year, 0, 1 );
    const lastDayOfYear = new Date( year, 11, 31 );

    const weeks = [];
    const monthLabels = [];

    let currentDay = new Date( firstDayOfYear );
    let currentWeek = [];
    let currentMonth = -1;

    const firstDayOfWeek = getDay( firstDayOfYear );
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push( null );
    }

    while (currentDay <= lastDayOfYear) {
      if (currentDay.getMonth() !== currentMonth) {
        currentMonth = currentDay.getMonth();
        monthLabels.push( {
          month: MONTHS[currentMonth],
          weekIndex: weeks.length
        } );
      }

      const dateKey = format( currentDay, "yyyy-MM-dd" );
      currentWeek.push( {
        key: dateKey,
        date: new Date( currentDay ),
        activity: activityByDate.get( dateKey ) || { count: 0, level: 0 },
      } );

      if (getDay( currentDay ) === 6) {
        weeks.push( currentWeek );
        currentWeek = [];
      }

      currentDay.setDate( currentDay.getDate() + 1 );
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push( null );
      }
      weeks.push( currentWeek );
    }

    const monthsByWeek = monthLabels.reduce( ( acc, { month, weekIndex } ) => {
      acc[weekIndex] = month;
      return acc;
    }, {} as Record<number, string> );

    return { weeks, monthsByWeek };
  }, [selectedYear, activityByDate] );

  const getBackgroundColorStyle = ( level: 0 | 1 | 2 | 3 | 4 ) => {
    if (level === 0) return {};
    const lightness = 90 - ( level * 15 );
    return { backgroundColor: `hsl(47.9 95.8% ${ lightness }%)` };
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-sm">Reading Activity</h3>

        {/* Year selection */ }
        <Select value={ selectedYear } onValueChange={ setSelectedYear }>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Year"/>
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
        <div className="text-xs text-muted-foreground">
          <div className="h-6 mb-2"></div>
          <div className="flex flex-col gap-1">
            <span className="h-4 leading-4"></span> {/* Sun */ }
            <span className="h-4 leading-4">Mon</span>
            <span className="h-4 leading-4"></span> {/* Tue */ }
            <span className="h-4 leading-4">Wed</span>
            <span className="h-4 leading-4"></span> {/* Thu */ }
            <span className="h-4 leading-4">Fri</span>
            <span className="h-4 leading-4"></span> {/* Sat */ }
          </div>
        </div>

        {/* Scrollable container for the calendar */ }
        <div className="overflow-x-auto">
          <div className="flex gap-1 h-6">
            { weeks.map( ( _, weekIndex ) => (
              <div key={ `month-${ weekIndex }` } className="w-4 text-xs text-muted-foreground">
                {/* Display the month name only if it starts on this week */ }
                { monthsByWeek[weekIndex] }
              </div>
            ) ) }
          </div>

          {/* Calendar grid */ }
          <div className="flex gap-1">
            <TooltipProvider delayDuration={ 10 }>
              { weeks.map( ( week, weekIndex ) => (
                <div key={ weekIndex } className="flex flex-col gap-1">
                  { week.map( ( day, dayIndex ) => {
                    if (!day) {
                      return <div key={ `padding-${ weekIndex }-${ dayIndex }` } className="h-4 w-4"/>;
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
                            { day.activity.count > 0 ? `${ day.activity.count } minutes on ` : "No activity on " }
                            { format( day.date, "MMM d, yyyy" ) }
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  } ) }
                </div>
              ) ) }
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}