"use client";
import { useCallback } from "react";
import { PaginationBar } from "@/components/pagination/pagination-bar";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationControls( { totalPages, currentPage }: PaginationControlsProps ) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = useCallback( ( pageNumber: number ) => {
    pageNumber = Math.max( 1, pageNumber );
    if (pageNumber > totalPages)
      return "";

    const params = new URLSearchParams( searchParams );
    params.set( "page", pageNumber.toString() );
    return `${ pathname }?${ params.toString() }`;
  }, [pathname, searchParams] );

  return (
    <div className="mt-8 mb-8">
      <PaginationBar
        currentPage={ currentPage }
        totalPages={ totalPages }
        hrefBuilder={ createPageURL }
      />
    </div>
  );
}