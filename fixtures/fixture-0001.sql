-- SQL Fixtures for User Book Statistics

-- 1. Declaration of the user's UUID for consistency
-- This variable will hold the UUID of our test user.
DO $$
DECLARE
user_id UUID := '1601ecfb-7c24-4727-b9c3-c07f810c2904';
BEGIN

-- 2. Clean up previous test data (Optional)
-- To ensure a fresh start, you can delete existing data for this user.
DELETE FROM public.reading_sessions WHERE uid = user_id;
DELETE FROM public.users_books WHERE uid = user_id;
DELETE FROM public.profiles WHERE id = user_id;
DELETE FROM public.books WHERE id BETWEEN 2001 AND 2010;

-- 3. Create a user in the 'profiles' table
-- This user will own the book data.
INSERT INTO public.profiles (id, email, picture)
VALUES (user_id, 'test.user@example.com', 'https://example.com/user-picture.png')
    ON CONFLICT (id) DO NOTHING;

-- 4. Insert sample books into the 'books' table
-- These are the books that will be associated with the user.
INSERT INTO public.books (id, title, authors, pages, publication_date, type) VALUES
(2001, 'The Midnight Library', '{"Matt Haig"}', 304, '2020-08-13', 'roman'),
(2002, 'Project Hail Mary', '{"Andy Weir"}', 496, '2021-05-04', 'roman'),
(2003, 'Dune', '{"Frank Herbert"}', 412, '1965-08-01', 'roman'),
(2004, 'The Hobbit', '{"J.R.R. Tolkien"}', 310, '1937-09-21', 'roman'),
(2005, 'Atomic Habits', '{"James Clear"}', 320, '2018-10-16', 'bd'),
(2006, 'Sapiens: A Brief History of Humankind', '{"Yuval Noah Harari"}', 464, '2015-02-10', 'manga'),
(2007, 'The Lord of the Rings', '{"J.R.R. Tolkien"}', 1178, '1954-07-29', 'manga'),
(2008, 'To Kill a Mockingbird', '{"Harper Lee"}', 324, '1960-07-11', 'bd'),
(2009, '1984', '{"George Orwell"}', 328, '1949-06-08', 'roman'),
(2010, 'A Brief History of Time', '{"Stephen Hawking"}', 256, '1988-04-01', 'bd')
    ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
                            authors = EXCLUDED.authors,
                            pages = EXCLUDED.pages;

-- 5. Associate books with the user in 'users_books'
-- This table defines the user's library and reading progress.
INSERT INTO public.users_books (uid, book_id, state, start_reading_date, end_reading_date, is_favorite, current_page) VALUES
-- Books in 'read' state (for avgReadingDays calculation)
(user_id, 2001, 'read', '2024-01-10T09:00:00Z', '2024-01-20T18:00:00Z', true, 304),   -- Read in 10 days
(user_id, 2002, 'read', '2024-02-05T12:00:00Z', '2024-02-25T20:00:00Z', true, 496),   -- Read in 20 days
(user_id, 2003, 'read', '2024-03-01T15:00:00Z', '2024-03-08T22:00:00Z', false, 412),  -- Read in 7 days

-- Books in 'reading' state
(user_id, 2004, 'reading', '2024-05-01T10:00:00Z', NULL, false, 150),
(user_id, 2005, 'reading', '2024-05-10T11:00:00Z', NULL, true, 50),

-- Books in 'later' state
(user_id, 2006, 'later', NULL, NULL, false, 0),
(user_id, 2007, 'later', NULL, NULL, false, 0),

-- Books in 'wishlist' state
(user_id, 2008, 'wishlist', NULL, NULL, false, 0),
(user_id, 2009, 'wishlist', NULL, NULL, false, 0),
(user_id, 2010, 'wishlist', NULL, NULL, false, 0);


-- 6. Add some reading sessions for context
-- This data can be used for more granular statistics.
INSERT INTO public.reading_sessions (uid, book_id, start_time, end_time, start_page, end_page, notes) VALUES
-- Sessions for a book that has been read (Book 1)
(user_id, 2001, '2024-01-10T09:00:00Z', '2024-01-10T10:30:00Z', 1, 50, 'Started the book, very intriguing premise.'),
(user_id, 2001, '2024-01-15T20:00:00Z', '2024-01-15T22:00:00Z', 51, 150, 'The plot is developing well.'),
(user_id, 2001, '2024-01-20T16:00:00Z', '2024-01-20T18:00:00Z', 151, 304, 'Finished it! What an ending.'),

-- Sessions for a book currently being read (Book 4)
(user_id, 2004, '2024-05-01T10:00:00Z', '2024-05-01T11:00:00Z', 1, 75, 'Beginning the adventure in Middle-earth.'),
(user_id, 2004, '2024-05-05T19:30:00Z', '2024-05-05T20:30:00Z', 76, 150, 'Met Gollum, a fascinating character.');

END $$;