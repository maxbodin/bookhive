import { BookType } from "@/app/types/book";

const VALID_BOOK_TYPES: BookType[] = ["bd", "manga", "roman"];

/**
 * Converts a standard search string into a case-insensitive, accent-insensitive
 */
function buildAccentInsensitiveRegex( query: string ): string {
  const normalized = query.normalize( "NFD" ).replace( /[\u0300-\u036f]/g, "" ).toLowerCase();
  const escaped = normalized.replace( /[.*+?^${}()|[\]\\]/g, "\\$&" );

  return escaped
    .replace( /a/g, "[aáàâäãå]" )
    .replace( /e/g, "[eéèêë]" )
    .replace( /i/g, "[iíìîï]" )
    .replace( /o/g, "[oóòôöõ]" )
    .replace( /u/g, "[uúùûü]" )
    .replace( /c/g, "[cç]" )
    .replace( /n/g, "[nñ]" );
}

/**
 * Applies shared text search (title/authors) and type filters to a Supabase query builder.
 * Safely handles both top-level tables and joined/embedded tables.
 *
 * @param queryBuilder - The Supabase query builder instance.
 * @param foreignTable - The alias of the embedded table.
 * @param query - The text search query.
 * @param types - Comma-separated list of types.
 * @returns The modified query builder.
 */
export function applySharedBookFilters(
  queryBuilder: any,
  foreignTable: string | null,
  query?: string,
  types?: string
) {
  // If we are targeting a joined table, we pass it to the .or() options.
  const options = foreignTable ? { foreignTable } : undefined;

  // Apply text search filter.
  if (query) {
    const sanitizedQuery = query.trim().toLowerCase();
    const regexPattern = buildAccentInsensitiveRegex( sanitizedQuery );

    // Wrap the pattern in double quotes and escape internal quotes for PostgREST.
    const safePattern = `"${ regexPattern.replace( /"/g, "\\\"" ) }"`;

    // Because we created a unified column `searchable_text` in the books table, we only need one condition now!
    // This searches title, description, publisher, and partial authors all at once.
    queryBuilder = queryBuilder.or( `searchable_text.imatch.${ safePattern }`, options );
  }

  // Apply type filter.
  if (types) {
    const typeArray = types.split( "," );
    const includesNull = typeArray.includes( "null" );
    const validTypes = typeArray.filter( ( t ) => VALID_BOOK_TYPES.includes( t as BookType ) );

    if (validTypes.length > 0 && includesNull) {
      // User selected both specific valid types AND "null" (No type).
      queryBuilder = queryBuilder.or( `type.in.(${ validTypes.join( "," ) }),type.is.null`, options );
    } else
      if (validTypes.length > 0) {
        // User selected ONLY specific valid types.
        queryBuilder = queryBuilder.or( `type.in.(${ validTypes.join( "," ) })`, options );
      } else
        if (includesNull) {
          // User selected ONLY "null" (No type).
          queryBuilder = queryBuilder.or( `type.is.null`, options );
        }
  }

  return queryBuilder;
}