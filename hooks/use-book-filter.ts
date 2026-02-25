"use client";

import { useSyncExternalStore } from "react";

class BookFilterStore {
  private state: string[] = [];
  private listeners = new Set<() => void>();

  // Use arrow functions to ensure "this" context is statically bound.
  subscribe = ( listener: () => void ) => {
    this.listeners.add( listener );
    return () => this.listeners.delete( listener );
  };

  getSnapshot = () => this.state;
  getServerSnapshot = () => this.state;

  setState = ( newState: string[] ) => {
    this.state = newState;
    // Notify all subscribed components to re-render instantly.
    this.listeners.forEach( ( listener ) => listener() );
  };
}

// Prevent Next.js HMR (Hot Reload) from resetting listeners by keeping the singleton strictly alive in the global scope.
const store: BookFilterStore =
  ( globalThis as any ).__BOOK_FILTER_STORE__ || new BookFilterStore();

if (process.env.NODE_ENV !== "production") {
  ( globalThis as any ).__BOOK_FILTER_STORE__ = store;
}

/**
 * Performant O(1) global store to share selected book states across all grids.
 */
export function useBookFilter() {
  const states = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  return [states, store.setState] as const;
}