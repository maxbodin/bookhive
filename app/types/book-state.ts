import { UserBook } from "@/app/types/user-book";

export type UserBookRecordMap = Record<number, UserBook>;

export type BookState = "read" | "reading" | "later" | "wishlist";