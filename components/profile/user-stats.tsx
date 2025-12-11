"use client";

import { useMemo, useState } from "react";
import { UserBook } from "@/app/types/user-book";
import { BooksByStatusCard } from "./stats/books-by-status-card";
import { AverageCompletionCard } from "@/components/profile/stats/average-completion-card";
import { BooksByTypesCard } from "@/components/profile/stats/books-by-types-card";
import { MonthlyReadsCard } from "@/components/profile/stats/monthly-reads-card";
import { ReadingSpeedCard } from "@/components/profile/stats/reading-speed-card";

interface UserStatsProps {
  userBooks: UserBook[];
}

/**
 * Component to display various statistics about a user's book collection.
 * @param userBooks
 * @constructor
 */
export function UserStats( { userBooks }: UserStatsProps ) {
  const [selectedYear, setSelectedYear] = useState( new Date().getFullYear() );
  const availableYears = [2022, 2023, 2024, 2025, 2026];

  const stats = useMemo( () => {
    // Filter books that have a valid end_reading_date and match the selected year.
    const readBooks = userBooks.filter( b => {
      if (b.state !== "read" || !b.end_reading_date) return false;
      const readYear = new Date( b.end_reading_date ).getFullYear();
      return readYear === selectedYear;
    } );

    // Stats on book states.
    const booksByState = {
      read: userBooks.filter( b => b.state === "read" ).length,
      reading: userBooks.filter( b => b.state === "reading" ).length,
      later: userBooks.filter( b => b.state === "later" ).length,
      wishlist: userBooks.filter( b => b.state === "wishlist" ).length,
    };

    const totalPagesRead = readBooks.reduce( ( acc, book ) => acc + ( book.pages || 0 ), 0 );
    const firstReadDate = readBooks.length > 0
      ? new Date( Math.min( ...readBooks.map( b => new Date( b.end_reading_date! ).getTime() ) ) )
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
    const readingDurations = userBooks
      .filter( b => b.state === "read" )
      .map( b => {
        if (b.start_reading_date && b.end_reading_date) {
          const start = new Date( b.start_reading_date ).getTime();
          const end = new Date( b.end_reading_date ).getTime();
          return ( end - start ) / ( 1000 * 3600 * 24 );
        }
        return null;
      } )
      .filter( ( d ): d is number => d !== null && d >= 0 );

    const avgReadingDays = readingDurations.length > 0
      ? readingDurations.reduce( ( a, b ) => a + b, 0 ) / readingDurations.length
      : 0;

    // Data for monthly reads chart.
    const booksReadPerMonth = readBooks.reduce( ( acc, book ) => {
      const monthIndex = new Date( book.end_reading_date! ).getMonth(); // 0-11
      acc[monthIndex] = ( acc[monthIndex] || 0 ) + 1;
      return acc;
    }, {} as Record<number, number> );

    const allMonths = Array.from( { length: 12 }, ( _, i ) => {
      return new Date( 0, i ).toLocaleString( "default", { month: "short" } );
    } );

    const monthlyReadsData = allMonths.map( ( month, index ) => ( {
      month,
      books: booksReadPerMonth[index] || 0,
    } ) );

    return {
      booksByState,
      booksByType,
      avgReadingDays,
      monthlyReadsData,
      pagesPerDay
    };
  }, [userBooks, selectedYear] );

  return (
    <div className="flex flex-col space-y-2">
      <BooksByStatusCard data={ stats.booksByState }/>
      <BooksByTypesCard data={ stats.booksByType }/>
      <AverageCompletionCard avgDays={ stats.avgReadingDays }/>
      <ReadingSpeedCard pagesPerDay={ stats.pagesPerDay }/>
      <MonthlyReadsCard
        data={ stats.monthlyReadsData }
        years={ availableYears }
        selectedYear={ selectedYear }
        onYearChange={ ( year ) => setSelectedYear( Number( year ) ) }
      />
    </div>
  );
}