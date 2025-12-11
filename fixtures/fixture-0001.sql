-- SQL Fixtures for User Book Statistics

-- 1. Declaration of the user's UUID for consistency
-- This variable will hold the UUID of our test user.
DO $$
DECLARE
user_id UUID := '1601ecfb-7c24-4727-b9c3-c07f810c2904';
BEGIN

-- 2. Clean up previous test data
-- To ensure a fresh start, we delete existing data for this user.
DELETE FROM public.reading_sessions WHERE uid = user_id;
DELETE FROM public.users_books WHERE uid = user_id;
DELETE FROM public.profiles WHERE id = user_id;
DELETE FROM public.books WHERE id BETWEEN 2001 AND 2020;

-- 3. Create a user in the 'profiles' table
-- This user will own the book data.
INSERT INTO public.profiles (id, email, picture)
VALUES (user_id, 'test.user@example.com', 'https://thumbs.dreamstime.com/b/crash-test-dummy-20256432.jpg')
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
-- This table defines the user's library and reading progress across several years.
INSERT INTO public.users_books (uid, book_id, state, start_wishlist_date, end_wishlist_date, start_later_date, end_later_date, start_reading_date, end_reading_date, read_date, is_favorite, current_page) VALUES
-- =====================================================================================
-- YEAR 2022
-- =====================================================================================
-- Read Books in 2022
(user_id, 2020, 'read', '2022-01-05T10:00:00Z', '2022-02-20T11:00:00Z', '2022-02-20T11:00:01Z', '2022-03-15T18:00:00Z', '2022-03-15T18:00:01Z', '2022-03-25T22:30:00Z', '2022-03-25T22:30:00Z', false, 224), -- The Catcher in the Rye
(user_id, 2016, 'read', '2022-04-01T12:00:00Z', '2022-05-10T14:00:00Z', NULL, NULL, '2022-05-10T14:00:01Z', '2022-05-11T20:00:00Z', '2022-05-11T20:00:00Z', true, 192), -- Naruto, Vol. 1 (quick read)
(user_id, 2015, 'read', NULL, NULL, '2022-01-01T00:00:00Z', '2022-08-01T09:00:00Z', '2022-08-01T09:00:01Z', '2022-08-10T21:00:00Z', '2022-08-10T21:00:00Z', true, 224), -- The Hitchhiker's Guide to the Galaxy
(user_id, 2009, 'read', '2022-06-10T16:00:00Z', '2022-09-01T10:00:00Z', '2022-09-01T10:00:01Z', '2022-10-02T19:00:00Z', '2022-10-02T19:00:01Z', '2022-10-20T23:15:00Z', '2022-10-20T23:15:00Z', false, 328), -- 1984
-- =====================================================================================
-- YEAR 2023
-- =====================================================================================
-- Read Books in 2023
(user_id, 2001, 'read', '2022-12-01T11:00:00Z', '2023-01-09T08:00:00Z', NULL, NULL, '2023-01-10T09:00:00Z', '2023-01-20T18:00:00Z', '2023-01-20T18:00:00Z', true, 304), -- The Midnight Library
(user_id, 2002, 'read', NULL, NULL, '2022-10-20T12:00:00Z', '2023-02-04T10:00:00Z', '2023-02-05T12:00:00Z', '2023-02-25T20:00:00Z', '2023-02-25T20:00:00Z', true, 496), -- Project Hail Mary
(user_id, 2011, 'read', NULL, NULL, NULL, NULL, '2023-04-02T10:00:00Z', '2023-04-03T11:00:00Z', '2023-04-03T11:00:00Z', true, 224), -- Berserk, Vol. 1 (bought and read immediately)
(user_id, 2013, 'read', '2023-01-15T19:00:00Z', '2023-04-09T17:00:00Z', NULL, NULL, '2023-04-10T18:00:00Z', '2023-04-12T23:00:00Z', '2023-04-12T23:00:00Z', false, 240), -- The Sandman, Vol. 1
(user_id, 2017, 'read', NULL, NULL, NULL, NULL, '2023-07-07T13:00:00Z', '2023-07-21T16:45:00Z', '2023-07-21T16:45:00Z', true, 288), -- The Colour of Magic
(user_id, 2014, 'read', '2023-05-20T10:00:00Z', '2023-08-30T10:00:00Z', '2023-08-30T10:00:01Z', '2023-10-10T14:00:00Z', '2023-10-10T14:00:01Z', '2023-11-05T21:00:00Z', '2023-11-05T21:00:00Z', true, 279), -- Pride and Prejudice
(user_id, 2003, 'reading', NULL, NULL, '2022-12-25T20:00:00Z', '2023-06-01T15:00:00Z', '2023-06-01T15:00:01Z', NULL, NULL, false, 250),
-- =====================================================================================
-- YEAR 2024
-- =====================================================================================
-- Read books in 2024
(user_id, 2007, 'read', '2022-11-15T14:30:00Z', '2023-12-28T18:00:00Z', '2023-12-28T18:00:01Z', '2024-01-01T09:59:00Z', '2024-01-01T10:00:00Z', '2024-02-15T19:00:00Z', '2024-02-15T19:00:00Z', true, 1178), -- The Lord of the Rings (the big one)
(user_id, 2012, 'read', NULL, NULL, NULL, NULL, '2024-03-01T12:30:00Z', '2024-03-02T14:00:00Z', '2024-03-02T14:00:00Z', false, 208), -- One Piece, Vol. 1
(user_id, 2018, 'read', '2023-10-01T00:00:00Z', '2024-03-15T17:00:00Z', NULL, NULL, '2024-03-16T11:00:00Z', '2024-03-18T22:45:00Z', '2024-03-18T22:45:00Z', true, 296), -- Maus
-- Currently Reading in 2024
(user_id, 2004, 'reading', '2023-02-10T11:00:00Z', '2024-04-30T12:00:00Z', NULL, NULL, '2024-05-01T10:00:00Z', NULL, NULL, false, 210), -- The Hobbit
(user_id, 2005, 'reading', '2024-01-01T09:00:00Z', '2024-05-09T15:00:00Z', NULL, NULL, '2024-05-10T11:00:00Z', NULL, NULL, true, 80), -- Atomic Habits
(user_id, 2019, 'reading', NULL, NULL, NULL, NULL, '2024-06-01T18:00:00Z', NULL, NULL, false, 55), -- Brave New World
-- Add to Wishlist/Later in 2024
(user_id, 2006, 'later', NULL, NULL, '2024-02-20T16:00:00Z', NULL, NULL, NULL, NULL, false, 0), -- Sapiens
(user_id, 2008, 'wishlist', '2024-04-10T20:30:00Z', NULL, NULL, NULL, NULL, NULL, NULL, false, 0), -- Watchmen
(user_id, 2010, 'wishlist', '2024-05-05T13:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, false, 0) -- A Brief History of Time
;


-- 6. Add a large number of reading sessions for a rich history
INSERT INTO public.reading_sessions (uid, book_id, start_time, end_time, start_page, end_page, notes) VALUES
-- Book 2020: The Catcher in the Rye (Read in 2022)
(user_id, 2020, '2022-03-15T18:00:01Z', '2022-03-15T19:30:00Z', 1, 35, 'Starting this classic.'),
(user_id, 2020, '2022-03-17T21:00:00Z', '2022-03-17T22:15:00Z', 36, 80, 'Holden is an interesting character.'),
(user_id, 2020, '2022-03-20T14:00:00Z', '2022-03-20T15:00:00Z', 81, 125, ''),
(user_id, 2020, '2022-03-24T22:00:00Z', '2022-03-24T23:00:00Z', 126, 190, 'Getting close to the end.'),
(user_id, 2020, '2022-03-25T21:30:00Z', '2022-03-25T22:30:00Z', 191, 224, 'Finished. A lot to think about.'),

-- Book 2016: Naruto, Vol. 1 (Read in 2022)
(user_id, 2016, '2022-05-10T14:00:01Z', '2022-05-10T15:30:00Z', 1, 90, 'Quick read, love the art.'),
(user_id, 2016, '2022-05-11T19:00:00Z', '2022-05-11T20:00:00Z', 91, 192, 'Done! On to the next volume.'),

-- Book 2015: The Hitchhiker's Guide to the Galaxy (Read in 2022)
(user_id, 2015, '2022-08-01T09:00:01Z', '2022-08-01T10:00:00Z', 1, 42, 'Don''t Panic!'),
(user_id, 2015, '2022-08-03T18:30:00Z', '2022-08-03T19:30:00Z', 43, 100, 'Hilarious.'),
(user_id, 2015, '2022-08-07T12:00:00Z', '2022-08-07T13:30:00Z', 101, 180, 'So long, and thanks for all the fish.'),
(user_id, 2015, '2022-08-10T20:00:00Z', '2022-08-10T21:00:00Z', 181, 224, 'What a ride. 42.'),

-- Book 2009: 1984 (Read in 2022)
(user_id, 2009, '2022-10-02T19:00:01Z', '2022-10-02T20:30:00Z', 1, 50, 'Chilling start.'),
(user_id, 2009, '2022-10-05T22:00:00Z', '2022-10-05T23:00:00Z', 51, 110, 'Big Brother is watching.'),
(user_id, 2009, '2022-10-10T21:00:00Z', '2022-10-10T22:30:00Z', 111, 200, ''),
(user_id, 2009, '2022-10-15T15:00:00Z', '2022-10-15T16:00:00Z', 201, 275, 'The appendix on Newspeak is fascinating.'),
(user_id, 2009, '2022-10-20T22:00:00Z', '2022-10-20T23:15:00Z', 276, 328, 'A powerful and terrifying ending.'),

-- Book 2001: The Midnight Library (Read in 2023)
(user_id, 2001, '2023-01-10T09:00:00Z', '2023-01-10T10:30:00Z', 1, 50, 'Started the book, very intriguing premise.'),
(user_id, 2001, '2023-01-12T21:00:00Z', '2023-01-12T22:00:00Z', 51, 102, 'Loving the different lives.'),
(user_id, 2001, '2023-01-15T20:00:00Z', '2023-01-15T22:00:00Z', 103, 215, 'The plot is developing well.'),
(user_id, 2001, '2023-01-18T19:00:00Z', '2023-01-18T19:45:00Z', 216, 260, 'Getting emotional.'),
(user_id, 2001, '2023-01-20T16:00:00Z', '2023-01-20T18:00:00Z', 261, 304, 'Finished it! What an ending.'),

-- Book 2002: Project Hail Mary (Read in 2023)
(user_id, 2002, '2023-02-05T12:00:00Z', '2023-02-05T13:30:00Z', 1, 60, 'Great start, classic Andy Weir.'),
(user_id, 2002, '2023-02-10T19:00:00Z', '2023-02-10T21:00:00Z', 61, 180, 'Rocky is the best character!'),
(user_id, 2002, '2023-02-15T10:00:00Z', '2023-02-15T11:00:00Z', 181, 250, 'Morning read.'),
(user_id, 2002, '2023-02-18T15:00:00Z', '2023-02-18T17:30:00Z', 251, 350, 'The science is fascinating.'),
(user_id, 2002, '2023-02-22T22:00:00Z', '2023-02-22T23:30:00Z', 351, 450, 'Can''t put it down.'),
(user_id, 2002, '2023-02-25T18:00:00Z', '2023-02-25T20:00:00Z', 451, 496, 'Amaze, amaze, amaze.'),

-- Book 2011: Berserk, Vol. 1 (Read in 2023)
(user_id, 2011, '2023-04-02T10:00:00Z', '2023-04-02T12:00:00Z', 1, 110, 'Incredible art, very dark.'),
(user_id, 2011, '2023-04-03T09:00:00Z', '2023-04-03T11:00:00Z', 111, 224, 'Finished volume 1, need more.'),

-- Book 2013: The Sandman, Vol. 1 (Read in 2023)
(user_id, 2013, '2023-04-10T18:00:00Z', '2023-04-10T20:00:00Z', 1, 100, 'Dreamlike and captivating.'),
(user_id, 2013, '2023-04-12T21:00:00Z', '2023-04-12T23:00:00Z', 101, 240, 'Finished. Gaiman is a master.'),

-- Book 2017: The Colour of Magic (Read in 2023)
(user_id, 2017, '2023-07-07T13:00:00Z', '2023-07-07T14:00:00Z', 1, 40, 'Love the humour already. Luggage!'),
(user_id, 2017, '2023-07-10T20:00:00Z', '2023-07-10T21:30:00Z', 41, 120, 'Rincewind is my spirit animal.'),
(user_id, 2017, '2023-07-15T11:00:00Z', '2023-07-15T12:00:00Z', 121, 200, ''),
(user_id, 2017, '2023-07-21T15:00:00Z', '2023-07-21T16:45:00Z', 201, 288, 'A fantastic start to Discworld.'),

-- Book 2014: Pride and Prejudice (Read in 2023)
(user_id, 2014, '2023-10-10T14:00:01Z', '2023-10-10T15:30:00Z', 1, 50, 'A truth universally acknowledged...'),
(user_id, 2014, '2023-10-18T21:00:00Z', '2023-10-18T22:00:00Z', 51, 100, 'Mr. Darcy is insufferable.'),
(user_id, 2014, '2023-10-25T19:00:00Z', '2023-10-25T20:30:00Z', 101, 200, 'Okay, maybe I was wrong about Darcy.'),
(user_id, 2014, '2023-11-05T19:00:00Z', '2023-11-05T21:00:00Z', 201, 279, 'Finished! A timeless classic.'),

-- Book 2003: Dune (Paused in 'reading' state)
(user_id, 2003, '2023-06-01T15:00:01Z', '2023-06-01T16:30:00Z', 1, 45, 'The spice must flow!'),
(user_id, 2003, '2023-06-05T20:00:00Z', '2023-06-05T21:30:00Z', 46, 110, 'World-building is immense.'),
(user_id, 2003, '2023-06-12T22:00:00Z', '2023-06-12T23:00:00Z', 111, 180, 'Lots of politics and prophecy.'),
(user_id, 2003, '2023-06-20T19:00:00Z', '2023-06-20T20:00:00Z', 181, 250, 'Taking a break, it''s very dense.'),

-- Book 2007: The Lord of the Rings (Read in 2024)
(user_id, 2007, '2024-01-01T10:00:00Z', '2024-01-01T11:30:00Z', 1, 25, 'Starting this epic journey again.'),
(user_id, 2007, '2024-01-03T20:00:00Z', '2024-01-03T21:00:00Z', 26, 60, ''),
(user_id, 2007, '2024-01-05T20:00:00Z', '2024-01-05T21:30:00Z', 61, 110, 'Leaving the Shire.'),
(user_id, 2007, '2024-01-08T21:00:00Z', '2024-01-08T22:00:00Z', 111, 160, ''),
(user_id, 2007, '2024-01-12T19:00:00Z', '2024-01-12T20:30:00Z', 161, 240, 'Fellowship is formed.'),
(user_id, 2007, '2024-01-16T22:00:00Z', '2024-01-16T23:00:00Z', 241, 300, 'Mines of Moria...'),
(user_id, 2007, '2024-01-20T14:00:00Z', '2024-01-20T16:00:00Z', 301, 400, 'Lothlórien.'),
(user_id, 2007, '2024-01-24T20:00:00Z', '2024-01-24T21:00:00Z', 401, 480, 'Breaking of the Fellowship.'),
(user_id, 2007, '2024-01-28T18:00:00Z', '2024-01-28T19:30:00Z', 481, 600, 'The Two Towers begins.'),
(user_id, 2007, '2024-02-02T22:00:00Z', '2024-02-02T23:30:00Z', 601, 750, 'Helm''s Deep.'),
(user_id, 2007, '2024-02-06T20:00:00Z', '2024-02-06T21:00:00Z', 751, 850, 'On the way to Isengard.'),
(user_id, 2007, '2024-02-10T18:00:00Z', '2024-02-10T20:00:00Z', 851, 1000, 'The Return of the King.'),
(user_id, 2007, '2024-02-13T21:00:00Z', '2024-02-13T22:30:00Z', 1001, 1100, 'The siege of Gondor.'),
(user_id, 2007, '2024-02-15T17:00:00Z', '2024-02-15T19:00:00Z', 1101, 1178, 'Done. An absolute masterpiece.'),

-- Book 2012: One Piece, Vol. 1 (Read in 2024)
(user_id, 2012, '2024-03-01T12:30:00Z', '2024-03-01T14:00:00Z', 1, 105, 'Starting the grand adventure!'),
(user_id, 2012, '2024-03-02T12:00:00Z', '2024-03-02T14:00:00Z', 106, 208, 'Finished! So much fun.'),

-- Book 2018: Maus (Read in 2024)
(user_id, 2018, '2024-03-16T11:00:00Z', '2024-03-16T13:00:00Z', 1, 150, 'Incredibly powerful and moving.'),
(user_id, 2018, '2024-03-18T21:00:00Z', '2024-03-18T22:45:00Z', 151, 296, 'A must-read. Heartbreaking.'),

-- Book 2004: The Hobbit (Currently Reading in 2024)
(user_id, 2004, '2024-05-01T10:00:00Z', '2024-05-01T11:00:00Z', 1, 75, 'Beginning the adventure in Middle-earth.'),
(user_id, 2004, '2024-05-05T19:30:00Z', '2024-05-05T20:30:00Z', 76, 150, 'Met Gollum, a fascinating character.'),
(user_id, 2004, '2024-05-15T21:00:00Z', '2024-05-15T22:00:00Z', 151, 210, 'Escaped the goblins.'),

-- Book 2005: Atomic Habits (Currently Reading in 2024)
(user_id, 2005, '2024-05-10T11:00:00Z', '2024-05-10T11:30:00Z', 1, 25, 'First chapter is very insightful.'),
(user_id, 2005, '2024-05-14T08:00:00Z', '2024-05-14T08:45:00Z', 26, 55, 'Applying some of these ideas already.'),
(user_id, 2005, '2024-05-20T12:00:00Z', '2024-05-20T12:30:00Z', 56, 80, '1% better every day.'),

-- Book 2019: Brave New World (Currently Reading in 2024)
(user_id, 2019, '2024-06-01T18:00:00Z', '2024-06-01T19:15:00Z', 1, 55, 'A strange and compelling world.');

END $$;