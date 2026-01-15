export interface ReadingSession {
  id: number;
  uid: string;
  book_id: number;
  start_time: string;
  end_time: string;
  start_page?: number | null;
  end_page: number;
  created_at?: string;
  notes?: string | null;
}

export interface ReadingSessionWithBook extends ReadingSession {
  book: {
    title: string;
    cover_url: string | null;
    pages?: number | null;
  } | null; // The associated book could be null if it was deleted.
}

export const SESSIONS_PAGE_SIZE = 20;