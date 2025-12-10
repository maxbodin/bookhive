/*

  // Reading speed stats
  const totalPagesRead = readBooks.reduce((acc, book) => acc + (book.pages || 0), 0);
  const firstReadDate = readBooks.length > 0
    ? new Date(Math.min(...readBooks.map(b => new Date(b.end_reading_date!).getTime())))
    : new Date();
  const daysSinceFirstRead = Math.max(1, (new Date().getTime() - firstReadDate.getTime()) / (1000 * 3600 * 24));

  const pagesPerDay = totalPagesRead / daysSinceFirstRead;

  // Book type stats
  const booksByType = userBooks.reduce((acc, book) => {
    const type = book.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Average time to finish a book
  const readingDurations = readBooks
    .map(b => {
      if (b.start_reading_date && b.end_reading_date) {
        const start = new Date(b.start_reading_date).getTime();
        const end = new Date(b.end_reading_date).getTime();
        return (end - start) / (1000 * 3600 * 24); // duration in days
      }
      return null;
    })
    .filter(d => d !== null && d > 0) as number[];

  const avgReadingDays = readingDurations.length > 0
    ? readingDurations.reduce((a, b) => a + b, 0) / readingDurations.length
    : 0;

  // Chart data for books read per month
  const booksReadPerMonth = readBooks.reduce((acc, book) => {
    const monthYear = new Date(book.end_reading_date!).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, books: 0 };
    }
    acc[monthYear].books++;
    return acc;
  }, {} as Record<string, { month: string, books: number }>);

  const chartData = Object.values(booksReadPerMonth).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const chartConfig = {
    books: {
      label: "Books",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col gap-6 px-2">


      <StatCard title="Reading Speed">
        <p>Pages per day: {pagesPerDay.toFixed(2)}</p>
        <p>Pages per month: {(pagesPerDay * 30.44).toFixed(2)}</p>
        <p>Pages per year: {(pagesPerDay * 365.25).toFixed(2)}</p>
      </StatCard>

      <StatCard title="Book Types">
        {Object.entries(booksByType).map(([type, count]) => (
          <p key={type}>
            {BOOK_TYPE_MAP[type as keyof typeof BOOK_TYPE_MAP] || 'Unknown'}: {count}
          </p>
        ))}
      </StatCard>

      <StatCard title="Average Time to Finish a Book">
        <p>{avgReadingDays.toFixed(2)} days</p>
      </StatCard>

      <div className="md:col-span-2 lg:col-span-3">
        <StatCard title="Books Read Per Month">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="books" fill="var(--color-books)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <p>No books read yet.</p>
          )}
        </StatCard>
      </div>
    </div>
  );
}*/


"use client";

import { useMemo } from "react";
import { UserBook } from "@/app/types/user-book";
import { BooksByStatusCard } from "./stats/books-by-status-card";

interface UserStatsProps {
  userBooks: UserBook[];
}

/**
 * Component to display various statistics about a user's book collection.
 * @param userBooks
 * @constructor
 */
export function UserStats( { userBooks }: UserStatsProps ) {
  const stats = useMemo( () => {
    const readBooks = userBooks.filter( b => b.state === "read" && b.end_reading_date );

    // Stats on book states.
    const booksByState = {
      read: readBooks.length,
      reading: userBooks.filter( b => b.state === "reading" ).length,
      later: userBooks.filter( b => b.state === "later" ).length,
      wishlist: userBooks.filter( b => b.state === "wishlist" ).length,
    };

/*    const totalPagesRead = readBooks.reduce( ( acc, book ) => acc + ( book.pages || 0 ), 0 );
    const firstReadDate = readBooks.length > 0
      ? new Date( Math.min( ...readBooks.map( b => new Date( b.end_reading_date! ).getTime() ) ) )
      : new Date();
    const daysSinceFirstRead = Math.max( 1, ( new Date().getTime() - firstReadDate.getTime() ) / ( 1000 * 3600 * 24 ) );
    const pagesPerDay = totalPagesRead > 0 ? totalPagesRead / daysSinceFirstRead : 0;

    const booksByType = userBooks.reduce( ( acc, book ) => {
      const type = book.type || "unknown";
      acc[type] = ( acc[type] || 0 ) + 1;
      return acc;
    }, {} as Record<string, number> );

    const readingDurations = readBooks
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

    const booksReadPerMonth = readBooks.reduce( ( acc, book ) => {
      const monthYear = new Date( book.end_reading_date! ).toLocaleString( "default", {
        month: "short",
        year: "numeric"
      } );
      if (!acc[monthYear]) acc[monthYear] = { month: monthYear, books: 0 };
      acc[monthYear].books++;
      return acc;
    }, {} as Record<string, { month: string, books: number }> );

    const monthlyReadsData = Object.values( booksReadPerMonth )
      .sort( ( a, b ) => new Date( a.month ).getTime() - new Date( b.month ).getTime() );*/

    return {
      booksByState,
/*      pagesPerDay,
      booksByType,
      avgReadingDays,
      monthlyReadsData */
    };
  }, [userBooks] );

  return (
    <div className="flex flex-col">
      <BooksByStatusCard data={ stats.booksByState }/>
      {/*<BookTypesCard data={stats.booksByType} />*/ }
      {/*<AverageCompletionCard avgDays={stats.avgReadingDays} />*/ }
      {/*<ReadingSpeedCard pagesPerDay={stats.pagesPerDay} />*/ }
      {/*<MonthlyReadsCard data={stats.monthlyReadsData} />*/ }
    </div>
  );
}
