"use client";

import { useMemo } from "react";
import { UserBookStatsRecord } from "@/app/types/user-book";
import { BooksByStatusCard } from "./stats/books-by-status-card";
import { AverageCompletionCard } from "@/components/profile/stats/average-completion-card";
import { BooksByTypesCard } from "@/components/profile/stats/books-by-types-card";
import { MonthlyCountByStateCard } from "@/components/profile/stats/monthly-count-by-state-card";
import { ReadingSpeedCard } from "@/components/profile/stats/reading-speed-card";
import { MonthlyPagesReadCard } from "@/components/profile/stats/monthly-pages-read-card";
import { ReadCompletionTrendCard } from "@/components/profile/stats/read-completion-trend-card";
import { useYearSelection } from "@/app/contexts/year-selection-context";
import { useLocale } from "next-intl";

interface UserStatsProps {
  userBooks: UserBookStatsRecord[];
}

/**
 * Component to display various statistics about a user's book collection.
 * @param userBooks
 * @constructor
 */
export function UserStats( { userBooks }: UserStatsProps ) {
  const { selectedYear } = useYearSelection();
  const locale = useLocale();

  const getReadCompletionDate = ( book: UserBookStatsRecord ): string | null => {
    if (book.state !== "read") return null;
    return book.end_reading_date ?? book.read_date ?? null;
  };

  const stats = useMemo( () => {
    const monthFormatter = new Intl.DateTimeFormat( locale, { month: "short" } );

    const allMonths = Array.from( { length: 12 }, ( _, i ) => {
      return monthFormatter.format( new Date( Date.UTC( 2020, i, 1 ) ) );
    } );

    // Filter books that are read and match the selected year based on completion date.
    const readBooksByYear = userBooks.filter( b => {
      const completionDate = getReadCompletionDate( b );
      if (!completionDate) return false;

      const readYear = new Date( completionDate ).getFullYear();
      return readYear === selectedYear;
    } );

    // Stats on book states.
    const booksByState = {
      read: userBooks.filter( b => b.state === "read" ).length,
      reading: userBooks.filter( b => b.state === "reading" ).length,
      later: userBooks.filter( b => b.state === "later" ).length,
      wishlist: userBooks.filter( b => b.state === "wishlist" ).length,
    };

    const monthlyCompletedCount = Array<number>( 12 ).fill( 0 );
    const monthlyPagesRead = Array<number>( 12 ).fill( 0 );

    readBooksByYear.forEach( ( book ) => {
      const completionDate = getReadCompletionDate( book );
      if (!completionDate) return;

      const monthIndex = new Date( completionDate ).getMonth();
      monthlyCompletedCount[monthIndex] += 1;
      monthlyPagesRead[monthIndex] += book.pages || 0;
    } );

    const monthlyPagesReadData = allMonths.map( ( month, index ) => ( {
      month,
      pages: monthlyPagesRead[index],
    } ) );

    let cumulative = 0;
    const readCompletionTrendData = allMonths.map( ( month, index ) => {
      cumulative += monthlyCompletedCount[index];

      return {
        month,
        completed: monthlyCompletedCount[index],
        cumulative,
      };
    } );

    const totalPagesRead = readBooksByYear.reduce( ( acc, book ) => acc + ( book.pages || 0 ), 0 );
    const firstReadDate = readBooksByYear.length > 0
      ? new Date( Math.min( ...readBooksByYear.map( b => new Date( getReadCompletionDate( b )! ).getTime() ) ) )
      : new Date();
    const daysSinceFirstRead = Math.max( 1, ( new Date().getTime() - firstReadDate.getTime() ) / ( 1000 * 3600 * 24 ) );
    const pagesPerDay = totalPagesRead > 0 ? totalPagesRead / daysSinceFirstRead : 0;

    // Stats on book types.
    const booksByType = userBooks.reduce( ( acc, book ) => {
      const type = book.type || "unknown";
      acc[type] = ( acc[type] || 0 ) + 1;
      return acc;
    }, {} as Record<string, number> );

    // Used for average reading time stats (on all read books).
    const readingDurations = readBooksByYear
      .map( b => {
        const completionDate = getReadCompletionDate( b );

        if (b.start_reading_date && completionDate) {
          const start = new Date( b.start_reading_date ).getTime();
          const end = new Date( completionDate ).getTime();
          return ( end - start ) / ( 1000 * 3600 * 24 );
        }
        return null;
      } )
      .filter( ( d ): d is number => d !== null && d >= 0 );

    const avgReadingDays = readingDurations.length > 0
      ? readingDurations.reduce( ( a, b ) => a + b, 0 ) / readingDurations.length
      : 0;

    // Helper to get the correct date based on the book's state
    const getRelevantDate = ( book: UserBookStatsRecord ): string | null => {
      switch (book.state) {
        case "read":
          return getReadCompletionDate( book ); // Considered read on completion date.
        case "reading":
          return book.start_reading_date ?? null; // "Reading" starts on this date
        case "later":
          return book.start_later_date ?? null; // Added to "later" list
        case "wishlist":
          return book.start_wishlist_date ?? null; // Added to "wishlist"
        default:
          return null;
      }
    };

    // Initialize a data structure to hold counts for all states for each month
    const monthlyActivityData = allMonths.map( month => ( {
      month,
      read: 0,
      reading: 0,
      later: 0,
      wishlist: 0,
    } ) );

    // Populate the data by iterating through all user books.
    userBooks.forEach( book => {
      const dateStr = getRelevantDate( book );
      if (!dateStr) return; // Skip if no relevant date for its state.

      const date = new Date( dateStr );
      if (date.getFullYear() === selectedYear) {
        const monthIndex = date.getMonth(); // 0-11
        // Increment the count for the specific state in the correct xxmonth.
        if (monthlyActivityData[monthIndex] && book.state) {
          monthlyActivityData[monthIndex][book.state]++;
        }
      }
    } );

    return {
      booksByState,
      booksByType,
      avgReadingDays,
      monthlyActivityData,
      pagesPerDay,
      monthlyPagesReadData,
      readCompletionTrendData,
    };
  }, [userBooks, selectedYear, locale] );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <BooksByStatusCard data={ stats.booksByState } className="xl:col-span-4"/>
      <BooksByTypesCard data={ stats.booksByType } className="xl:col-span-4"/>
      <AverageCompletionCard avgDays={ stats.avgReadingDays } className="xl:col-span-4"/>
      <ReadingSpeedCard pagesPerDay={ stats.pagesPerDay } className="xl:col-span-6"/>
      <MonthlyPagesReadCard data={ stats.monthlyPagesReadData } className="xl:col-span-6"/>
      <MonthlyCountByStateCard data={ stats.monthlyActivityData } className="xl:col-span-6"/>
      <ReadCompletionTrendCard data={ stats.readCompletionTrendData } className="xl:col-span-6"/>
    </div>
  );
}