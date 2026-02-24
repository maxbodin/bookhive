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

  // Apply text search filter (title OR authors)
  if (query) {
    const sanitizedQuery = query.trim().toLowerCase();

    const textFilters = [
      `title.ilike.%${ sanitizedQuery }%`,
      `description.ilike.%${ sanitizedQuery }%`,
      `publisher.ilike.%${ sanitizedQuery }%`,
      `isbn_10.ilike.%${ sanitizedQuery }%`,
      `isbn_13.ilike.%${ sanitizedQuery }%`,
      `authors.cs.{${ sanitizedQuery }}`
    ];

    queryBuilder = queryBuilder.or( textFilters.join( "," ), options );
  }

  // Apply type filter.
  if (types) {
    const typeArray = types.split( "," );
    // Separate the string "null" from actual enum values like "bd" or "manga".
    const validTypes = typeArray.filter( ( t ) => t !== "null" );
    const includesNull = typeArray.includes( "null" );

    if (validTypes.length > 0 && includesNull) {
      // User selected both specific types AND "null" (No type).
      queryBuilder = queryBuilder.or( `type.in.(${ validTypes.join( "," ) }),type.is.null`, options );
    } else
      if (validTypes.length > 0) {
        // User selected ONLY specific types.
        queryBuilder = queryBuilder.or( `type.in.(${ validTypes.join( "," ) })`, options );
      } else
        if (includesNull) {
          // User selected ONLY "null" (No type).
          queryBuilder = queryBuilder.or( `type.is.null`, options );
        }
  }

  return queryBuilder;
}