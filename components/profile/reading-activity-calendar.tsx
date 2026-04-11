"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ReadingSession } from "@/app/types/reading-session";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { processSessionsForCalendar } from "@/app/utils/profiles/processSessionsForCalendar";
import { getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useYearSelection } from "@/app/contexts/year-selection-context";

interface ReadingActivityCalendarProps {
  readingSessions: ReadingSession[];
}

export function ReadingActivityCalendar( { readingSessions }: ReadingActivityCalendarProps ) {
  const t = useTranslations( "ReadingActivityCalendar" );
  const locale = useLocale();
  const { selectedYear } = useYearSelection();

  const activityByDate = useMemo( () => processSessionsForCalendar( readingSessions ), [readingSessions] );

  const weekdayLabels = useMemo( () => {
    const weekdayFormatter = new Intl.DateTimeFormat( locale, { weekday: "short" } );
    const sundayReferenceUtc = Date.UTC( 2020, 7, 2 );

    return Array.from( { length: 7 }, ( _, index ) => {
      return weekdayFormatter.format( new Date( sundayReferenceUtc + ( index * 24 * 60 * 60 * 1000 ) ) );
    } );
  }, [locale] );

  const monthFormatter = useMemo( () => new Intl.DateTimeFormat( locale, { month: "long" } ), [locale] );
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat( locale, { month: "short", day: "numeric", year: "numeric" } ),
    [locale]
  );


  const { months } = useMemo( () => {
    const year = selectedYear;
    const months = Array.from( { length: 12 }, ( _, monthIndex ) => {
      const firstDayOfMonth = new Date( Number( year ), monthIndex, 1 );
      const monthName = monthFormatter.format( firstDayOfMonth );
      const weeks = [];
      let currentWeek = new Array( 7 ).fill( null );
      const currentDate = new Date( firstDayOfMonth );

      while (currentDate.getMonth() === monthIndex) {
        const dayOfWeek = getDay( currentDate );
        const yearPart = currentDate.getFullYear();
        const monthPart = String( currentDate.getMonth() + 1 ).padStart( 2, "0" );
        const dayPart = String( currentDate.getDate() ).padStart( 2, "0" );
        const dateKey = `${ yearPart }-${ monthPart }-${ dayPart }`;

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
  }, [selectedYear, activityByDate, monthFormatter] );

  const getBackgroundColorStyle = ( level: 0 | 1 | 2 | 3 | 4 ) => {
    if (level === 0) return {};
    const lightness = ( level * 15 );
    return { backgroundColor: `hsl(47.9 95.8% ${ lightness }%)` };
  };

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm">{ t( "title" ) }</h2>
        <YearSelection/>
      </div>

      {/* Weekdays */ }
      <div className="flex gap-3">
        <div className="text-xs text-muted-foreground pr-2 mt-1">
          <div className="h-6"></div>
          <div className="flex flex-col gap-1">
            { weekdayLabels.map( ( day, index ) => (
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
                                  { dayFormatter.format( day.date ) }
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