export type BookStateMap = {
  [bookId: number]: BookState | undefined;
};

export type BookState = "read" | "reading" | "later" | "wishlist";