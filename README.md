# BookHive

BookHive is a reading platform built with Next.js, TypeScript, and Supabase.
It helps users organize their library, track reading sessions, and analyze reading habits with rich profile analytics.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Domain Model](#domain-model-simplified)
- [Project Structure](#project-structure)

## Overview

BookHive centralizes the full reading lifecycle in one place:

- Discover and browse books.
- Organize books into shelves (`wishlist`, `later`, `reading`, `read`).
- Log reading sessions with time, pages, and notes.
- Visualize progress and trends on profile dashboards.

## Features

- Account management with Supabase Auth:
	- Sign up, login, logout.
	- Password reset flow.
	- Session-aware middleware route protection.
- Personal bookshelves:
	- Book state transitions (`wishlist` -> `later` -> `reading` -> `read`).
	- Favorites and progress tracking.
- Reading sessions:
	- Session history with date/time, page ranges, duration, and notes.
	- Session-driven navigation to book details.
- Profile analytics:
	- Status and type distribution.
	- Monthly activity and page trends.
	- Reading speed, duration, lifecycle, weekday patterns, and read-length distribution.
- Admin-only catalog enrichment:
	- Open Library search and import path.
- Internationalization:
	- Locale-based translations with `next-intl`.

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Runtime and package manager: Bun
- Backend and auth: Supabase
- UI: Shadcn, Tailwind, Radix UI, Lucide, Recharts
- Motion and transitions: Framer Motion, React View Transitions
- Localization: `next-intl`

### Domain model (simplified)

- `profiles`: user metadata.
- `books`: canonical catalog entries.
- `users_books`: per-user book ownership, state, dates, and progress.
- `reading_sessions`: session-level reading logs.

## Project Structure

```text
app/
	actions/                # Server actions (books, profiles, sessions, users_books, auth)
	(profile)/[email]/      # Profile route with shelves, sessions, stats
	book/[id]/              # Book detail page
	utils/                  # Route helpers, search params, Supabase adapters
components/
	books/                  # Book cards, covers, shelves
	profile/                # Profile UI and analytics cards
	sessions/               # Reading session list and items
	ui/                     # Shared UI primitives
messages/                 # i18n dictionaries (en, fr)
```