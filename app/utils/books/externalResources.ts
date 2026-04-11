import { Book } from "@/app/types/book";

type ExternalBookFields = Pick<Book, "isbn_10" | "isbn_13" | "open_library_key">;

const ANNAS_ARCHIVE_BASE_URL = "https://annas-archive.gl";
const OPEN_LIBRARY_ID_PATTERN = /(OL\d+[A-Z0-9]*)/i;

export type AnnasArchiveLinkType = "search" | "isbnDb" | "openLibrary";

export interface AnnasArchiveLink {
  type: AnnasArchiveLinkType;
  href: string;
}

export interface BookExternalResources {
  normalizedIsbn: string | null;
  openLibraryId: string | null;
  annasArchiveLinks: AnnasArchiveLink[];
}

const normalizeIsbn = ( rawIsbn?: string | null ): string | null => {
  if ( !rawIsbn ) return null;

  const normalized = rawIsbn.replace( /[^0-9xX]/g, "" ).toUpperCase();
  if ( !normalized ) return null;

  const isValidIsbn10 = /^[0-9]{9}[0-9X]$/.test( normalized );
  const isValidIsbn13 = /^[0-9]{13}$/.test( normalized );

  return isValidIsbn10 || isValidIsbn13 ? normalized : null;
};

const extractOpenLibraryId = ( rawValue?: string | null ): string | null => {
  if ( !rawValue ) return null;

  const trimmed = rawValue.trim();
  if ( !trimmed ) return null;

  const match = trimmed.match( OPEN_LIBRARY_ID_PATTERN );
  return match ? match[ 1 ].toUpperCase() : null;
};

/**
 * Returns normalized external identifiers and corresponding Anna's Archive links.
 */
export function getBookExternalResources( book: ExternalBookFields ): BookExternalResources {
  const normalizedIsbn = normalizeIsbn( book.isbn_13 ) ?? normalizeIsbn( book.isbn_10 );
  const openLibraryId = extractOpenLibraryId( book.open_library_key );

  const annasArchiveLinks: AnnasArchiveLink[] = [];

  if ( normalizedIsbn ) {
    annasArchiveLinks.push(
      {
        type: "search",
        href: `${ ANNAS_ARCHIVE_BASE_URL }/search?index=meta&q=${ encodeURIComponent( normalizedIsbn ) }`
      },
      {
        type: "isbnDb",
        href: `${ ANNAS_ARCHIVE_BASE_URL }/isbndb/${ encodeURIComponent( normalizedIsbn ) }`
      }
    );
  }

  if ( openLibraryId ) {
    annasArchiveLinks.push( {
      type: "openLibrary",
      href: `${ ANNAS_ARCHIVE_BASE_URL }/ol/${ encodeURIComponent( openLibraryId ) }`
    } );
  }

  return {
    normalizedIsbn,
    openLibraryId,
    annasArchiveLinks,
  };
}