import { UserBookStatsRecord } from "@/app/types/user-book";

export type ReadDurationBucket = "upToWeek" | "upToMonth" | "upToThreeMonths" | "overThreeMonths";
export type BookTypeBucket = "bd" | "manga" | "roman" | "unknown";
export type ReadLengthBucket = "upTo150" | "from151To300" | "from301To500" | "over500";

export interface StrictReadBook extends UserBookStatsRecord {
  startDate: Date;
  endDate: Date;
  completionDate: Date;
}

export const toValidDate = ( value?: string | null ): Date | null => {
  if (!value) return null;

  const parsedDate = new Date( value );
  return Number.isNaN( parsedDate.getTime() ) ? null : parsedDate;
};

export const toBookTypeBucket = ( value?: string | null ): BookTypeBucket => {
  const normalizedType = value?.toLowerCase();
  if (normalizedType === "bd" || normalizedType === "manga" || normalizedType === "roman") return normalizedType;
  return "unknown";
};

export const getDurationBucket = ( durationInDays: number ): ReadDurationBucket => {
  if (durationInDays <= 7) return "upToWeek";
  if (durationInDays <= 30) return "upToMonth";
  if (durationInDays <= 90) return "upToThreeMonths";
  return "overThreeMonths";
};

export const getReadLengthBucket = ( pages: number ): ReadLengthBucket => {
  if (pages <= 150) return "upTo150";
  if (pages <= 300) return "from151To300";
  if (pages <= 500) return "from301To500";
  return "over500";
};

export const getMonthLabels = ( locale: string ): string[] => {
  const monthFormatter = new Intl.DateTimeFormat( locale, { month: "short" } );

  return Array.from( { length: 12 }, ( _, i ) => {
    return monthFormatter.format( new Date( Date.UTC( 2020, i, 1 ) ) );
  } );
};

export const getWeekdayLabels = ( locale: string ): string[] => {
  const weekdayFormatter = new Intl.DateTimeFormat( locale, { weekday: "short", timeZone: "UTC" } );

  return Array.from( { length: 7 }, ( _, i ) => {
    return weekdayFormatter.format( new Date( Date.UTC( 2020, 5, i + 1 ) ) );
  } );
};

export const toStrictReadBook = ( book: UserBookStatsRecord ): StrictReadBook | null => {
  if (book.state !== "read") return null;

  const startDate = toValidDate( book.start_reading_date );
  const endDate = toValidDate( book.end_reading_date );

  if (!startDate || !endDate) return null;

  const completionDate = toValidDate( book.read_date ) ?? endDate;

  return {
    ...book,
    startDate,
    endDate,
    completionDate,
  };
};

export const getStrictReadBooks = ( userBooks: UserBookStatsRecord[] ): StrictReadBook[] => {
  return userBooks
    .map( toStrictReadBook )
    .filter( ( book ): book is StrictReadBook => book !== null );
};

export const getStrictReadBooksByYear = ( userBooks: UserBookStatsRecord[], year: number ): StrictReadBook[] => {
  return getStrictReadBooks( userBooks ).filter( ( book ) => book.completionDate.getUTCFullYear() === year );
};

export const getRelevantStateDate = ( book: UserBookStatsRecord ): Date | null => {
  switch (book.state) {
    case "read": {
      const strictReadBook = toStrictReadBook( book );
      return strictReadBook?.completionDate ?? null;
    }
    case "reading":
      return toValidDate( book.start_reading_date );
    case "later":
      return toValidDate( book.start_later_date );
    case "wishlist":
      return toValidDate( book.start_wishlist_date );
    default:
      return null;
  }
};