type BookLike = {
  id: number | string;
  book_id?: number | string | null;
};

/**
 * Resolves the canonical book id used to relate profile books with connected-user shelf records.
 * Falls back to `id` for plain `Book` objects and prefers `book_id` for `UserBook` objects.
 */
export function getBookRelationId( book: BookLike ): number {
  const rawId = book.book_id ?? book.id;
  return typeof rawId === "number" ? rawId : Number( rawId );
}

/**
 * String key variant used for map lookups to avoid number/string key mismatches at runtime.
 */
export function getBookRelationKey( book: BookLike ): string {
  return String( getBookRelationId( book ) );
}