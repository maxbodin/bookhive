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