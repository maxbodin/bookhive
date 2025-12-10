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
DELETE FROM public.books WHERE id BETWEEN 2001 AND 2020;

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
(2007, 'The Lord of the Rings', '{"J.R.R. Tolkien"}', 1178, '1954-07-29', 'roman'),
(2008, 'Watchmen', '{"Alan Moore", "Dave Gibbons"}', 416, '1987-07-01', 'bd'),
(2009, '1984', '{"George Orwell"}', 328, '1949-06-08', 'roman'),
(2010, 'A Brief History of Time', '{"Stephen Hawking"}', 256, '1988-04-01', 'bd'),
(2011, 'Berserk, Vol. 1', '{"Kentaro Miura"}', 224, '1990-11-26', 'manga'),
(2012, 'One Piece, Vol. 1', '{"Eiichiro Oda"}', 208, '1997-12-24', 'manga'),
(2013, 'The Sandman, Vol. 1: Preludes & Nocturnes', '{"Neil Gaiman"}', 240, '1989-01-01', 'bd'),
(2014, 'Pride and Prejudice', '{"Jane Austen"}', 279, '1813-01-28', 'roman'),
(2015, 'The Hitchhiker''s Guide to the Galaxy', '{"Douglas Adams"}', 224, '1979-10-12', 'roman'),
(2016, 'Naruto, Vol. 1', '{"Masashi Kishimoto"}', 192, '2000-03-03', 'manga'),
(2017, 'The Colour of Magic', '{"Terry Pratchett"}', 288, '1983-11-24', 'roman'),
(2018, 'Maus', '{"Art Spiegelman"}', 296, '1986-09-01', 'bd'),
(2019, 'Brave New World', '{"Aldous Huxley"}', 288, '1932-08-01', 'roman'),
(2020, 'The Catcher in the Rye', '{"J. D. Salinger"}', 224, '1951-07-16', 'roman')
    ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
                            authors = EXCLUDED.authors,
                            pages = EXCLUDED.pages;

-- 5. Associate books with the user in 'users_books'
-- This table defines the user's library and reading progress.
INSERT INTO public.users_books (uid, book_id, state, start_reading_date, end_reading_date, is_favorite, current_page) VALUES
-- Books in 'read' state (for avgReadingDays calculation)
(user_id, 2001, 'read', '2023-01-10T09:00:00Z', '2023-01-20T18:00:00Z', true, 304),      -- Read in 10 days
(user_id, 2002, 'read', '2023-02-05T12:00:00Z', '2023-02-25T20:00:00Z', true, 496),      -- Read in 20 days
(user_id, 2003, 'read', '2023-03-01T15:00:00Z', '2023-03-08T22:00:00Z', false, 412),     -- Read in 7 days
(user_id, 2011, 'read', '2023-04-02T10:00:00Z', '2023-04-03T11:00:00Z', true, 224),       -- Read in 1 day (Manga)
(user_id, 2013, 'read', '2023-04-10T18:00:00Z', '2023-04-12T23:00:00Z', false, 240),     -- Read in 2 days (BD)
(user_id, 2015, 'read', '2023-05-15T14:00:00Z', '2023-05-20T16:00:00Z', true, 224),      -- Read in 5 days
(user_id, 2009, 'read', '2023-06-01T20:00:00Z', '2023-06-15T20:00:00Z', false, 328),     -- Read in 14 days
(user_id, 2007, 'read', '2024-01-01T10:00:00Z', '2024-02-15T19:00:00Z', true, 1178),     -- Read in 45 days (long book)

-- Books in 'reading' state
(user_id, 2004, 'reading', '2024-05-01T10:00:00Z', NULL, false, 150),
(user_id, 2005, 'reading', '2024-05-10T11:00:00Z', NULL, true, 50),
(user_id, 2018, 'reading', '2024-05-12T15:00:00Z', NULL, false, 120),

-- Books in 'later' state
(user_id, 2006, 'later', NULL, NULL, false, 0),
(user_id, 2010, 'later', NULL, NULL, false, 0),
(user_id, 2014, 'later', NULL, NULL, true, 0),
(user_id, 2019, 'later', NULL, NULL, false, 0),

-- Books in 'wishlist' state
(user_id, 2008, 'wishlist', NULL, NULL, false, 0),
(user_id, 2012, 'wishlist', NULL, NULL, false, 0),
(user_id, 2016, 'wishlist', NULL, NULL, false, 0),
(user_id, 2017, 'wishlist', NULL, NULL, false, 0),
(user_id, 2020, 'wishlist', NULL, NULL, false, 0);


-- 6. Add a large number of reading sessions for a rich history
INSERT INTO public.reading_sessions (uid, book_id, start_time, end_time, start_page, end_page, notes) VALUES
-- Book 2001: The Midnight Library (Read)
(user_id, 2001, '2023-01-10T09:00:00Z', '2023-01-10T10:30:00Z', 1, 50, 'Started the book, very intriguing premise.'),
(user_id, 2001, '2023-01-12T21:00:00Z', '2023-01-12T22:00:00Z', 51, 102, 'Loving the different lives.'),
(user_id, 2001, '2023-01-15T20:00:00Z', '2023-01-15T22:00:00Z', 103, 215, 'The plot is developing well.'),
(user_id, 2001, '2023-01-20T16:00:00Z', '2023-01-20T18:00:00Z', 216, 304, 'Finished it! What an ending.'),

-- Book 2002: Project Hail Mary (Read)
(user_id, 2002, '2023-02-05T12:00:00Z', '2023-02-05T13:00:00Z', 1, 60, 'Great start, classic Andy Weir.'),
(user_id, 2002, '2023-02-10T19:00:00Z', '2023-02-10T21:00:00Z', 61, 180, 'Rocky is the best character!'),
(user_id, 2002, '2023-02-18T15:00:00Z', '2023-02-18T17:30:00Z', 181, 350, 'The science is fascinating.'),
(user_id, 2002, '2023-02-25T18:00:00Z', '2023-02-25T20:00:00Z', 351, 496, 'Amaze, amaze, amaze.'),

-- Book 2011: Berserk, Vol. 1 (Read)
(user_id, 2011, '2023-04-02T10:00:00Z', '2023-04-02T12:00:00Z', 1, 110, 'Incredible art, very dark.'),
(user_id, 2011, '2023-04-03T09:00:00Z', '2023-04-03T11:00:00Z', 111, 224, 'Finished volume 1, need more.'),

-- Book 2007: The Lord of the Rings (Read)
(user_id, 2007, '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z', 1, 25, 'Starting this epic journey again.'),
(user_id, 2007, '2024-01-05T20:00:00Z', '2024-01-05T21:30:00Z', 26, 80, 'Leaving the Shire.'),
(user_id, 2007, '2024-01-15T21:00:00Z', '2024-01-15T22:00:00Z', 81, 150, 'Fellowship is formed.'),
(user_id, 2007, '2024-01-25T19:00:00Z', '2024-01-25T20:00:00Z', 151, 280, 'Mines of Moria...'),
(user_id, 2007, '2024-02-02T22:00:00Z', '2024-02-02T23:00:00Z', 281, 500, 'Long read, but worth it.'),
(user_id, 2007, '2024-02-10T18:00:00Z', '2024-02-10T20:00:00Z', 501, 950, 'Almost there.'),
(user_id, 2007, '2024-02-15T17:00:00Z', '2024-02-15T19:00:00Z', 951, 1178, 'Done. An absolute masterpiece.'),

-- Book 2004: The Hobbit (Reading)
(user_id, 2004, '2024-05-01T10:00:00Z', '2024-05-01T11:00:00Z', 1, 75, 'Beginning the adventure in Middle-earth.'),
(user_id, 2004, '2024-05-05T19:30:00Z', '2024-05-05T20:30:00Z', 76, 150, 'Met Gollum, a fascinating character.'),

-- Book 2005: Atomic Habits (Reading)
(user_id, 2005, '2024-05-10T11:00:00Z', '2024-05-10T11:30:00Z', 1, 25, 'First chapter is very insightful.'),
(user_id, 2005, '2024-05-11T08:00:00Z', '2024-05-11T08:30:00Z', 26, 50, 'Applying some of these ideas already.'),

-- Book 2018: Maus (Reading)
(user_id, 2018, '2024-05-12T15:00:00Z', '2024-05-12T16:30:00Z', 1, 120, 'Powerful and heartbreaking story.');

END $$;