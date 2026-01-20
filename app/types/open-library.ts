/**
 * Interface for the detailed response from the Open Library Search API.
 */
export interface OpenLibrarySearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year: number;
  number_of_pages_median?: number;
  language: string[];
}

/**
 * Interface for the detailed response from the Open Library Works API.
 * e.g., https://openlibrary.org/works/OL29050559W.json
 */
export interface OpenLibraryWorkDetails {
  key: string;
  title: string;
  description?: string | { type: string; value: string };
  authors?: { author: { key: string } }[];
  subjects?: string[];
  covers?: number[];
  created: { value: string };
}

/**
 * Interface for the response from the Open Library Author API.
 * e.g., https://openlibrary.org/authors/OL7486601A.json
 */
export interface OpenLibraryAuthorDetails {
  key: string;
  name: string;
  personal_name?: string;
}

/**
 * Interface for a single edition entry from the Editions API.
 * e.g., https://openlibrary.org/works/OL29050559W/editions.json
 */
export interface OpenLibraryEditionEntry {
  key: string;
  title: string;
  publish_date?: string;
  publishers?: string[];
  number_of_pages?: number;
  isbn_10?: string[];
  isbn_13?: string[];
  covers?: number[];
  works: { key: string }[];
  type: { key: string };
  physical_format?: string;
}

/**
 * Interface for the top-level response from the Editions API.
 */
export interface OpenLibraryEditionsResponse {
  links: {
    self: string;
    work: string;
    next?: string;
  };
  size: number;
  entries: OpenLibraryEditionEntry[];
}