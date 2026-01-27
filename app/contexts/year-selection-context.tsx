"use client";

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface YearSelectionContextType {
  availableYears: number[];
  selectedYear: number;
  setSelectedYear: ( year: number ) => void;
}

const YearSelectionContext = createContext<YearSelectionContextType | undefined>( undefined );

interface YearSelectionProviderProps {
  initialYears: number[];
  children: ReactNode;
}

export function YearSelectionProvider( { initialYears, children }: YearSelectionProviderProps ) {
  const [availableYears] = useState<number[]>(
    initialYears.length > 0 ? initialYears : [new Date().getFullYear()],
  );
  const [selectedYear, setSelectedYearState] = useState<number>(
    availableYears[0]
  );

  // Update selected year if available years change and the current one is no longer valid.
  useEffect( () => {
    if (availableYears.length > 0 && !availableYears.includes( selectedYear )) {
      setSelectedYear( availableYears[0] );
    }
  }, [availableYears, selectedYear] );

  const setSelectedYear = useCallback( ( year: number ) => {
    setSelectedYearState( year );
  }, [] );

  // Memoize the context value to prevent unnecessary re-renders of consumers.
  const value = useMemo(
    () => ( {
      availableYears,
      selectedYear,
      setSelectedYear,
    } ),
    [availableYears, selectedYear, setSelectedYear],
  );

  return (
    <YearSelectionContext.Provider value={ value }>
      { children }
    </YearSelectionContext.Provider>
  );
}

export function useYearSelection() {
  const context = useContext( YearSelectionContext );
  if (context === undefined) {
    throw new Error( "useYearSelection must be used within a YearSelectionProvider" );
  }
  return context;
}