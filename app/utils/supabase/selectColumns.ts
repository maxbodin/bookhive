export const BOOK_LIST_COLUMNS =
  "id,title,authors,cover_url,pages,type,open_library_key";

export const BOOK_DETAIL_COLUMNS =
  "id,created_at,isbn_10,title,description,authors,publisher,cover_url,height,length,width,weight,pages,categories,publication_date,isbn_13,type,open_library_key";

export const USER_BOOK_STATE_COLUMNS =
  "id,uid,book_id,state,current_page,is_favorite,start_reading_date,end_reading_date,read_date,start_wishlist_date,end_wishlist_date,start_later_date,end_later_date";

export const USER_BOOK_WITH_BOOK_LIST_COLUMNS =
  "id,uid,book_id,state,current_page,is_favorite,start_reading_date,end_reading_date,read_date,start_wishlist_date,end_wishlist_date,start_later_date,end_later_date,books!inner(id,title,authors,cover_url,pages,type,open_library_key)";

export const USER_BOOK_STATS_COLUMNS =
  "state,start_reading_date,end_reading_date,read_date,start_wishlist_date,start_later_date,books!inner(pages,type)";

export const PROFILE_BASIC_COLUMNS =
  "id,email,username,created_at,picture,is_admin";
