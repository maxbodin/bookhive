"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationControls( { totalPages, currentPage }: PaginationControlsProps ) {
  const t = useTranslations( "PaginationControls" );

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = ( pageNumber: number ) => {
    pageNumber = Math.max( 1, pageNumber );
    if (pageNumber > totalPages)
      return "";

    const params = new URLSearchParams( searchParams );
    params.set( "page", pageNumber.toString() );
    return `${ pathname }?${ params.toString() }`;
  };

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button asChild={hasPrevPage} variant="outline" size="icon" disabled={ !hasPrevPage }>
        <Link href={ createPageURL( currentPage - 1 ) } aria-disabled={ !hasPrevPage }>
          <ChevronLeftIcon className="h-4 w-4"/>
          <span className="sr-only">{ t( "previousPage" ) }</span>
        </Link>
      </Button>

      <span className="text-sm font-medium">
        { t( "pageIndicator", {
          currentPage: currentPage,
          totalPages: totalPages,
        } ) }
      </span>

      <Button asChild={hasNextPage} variant="outline" size="icon" disabled={ !hasNextPage }>
        <Link href={ createPageURL( currentPage + 1 ) } aria-disabled={ !hasNextPage }>
          <ChevronRightIcon className="h-4 w-4"/>
          <span className="sr-only">{ t( "nextPage" ) }</span>
        </Link>
      </Button>
    </div>
  );
}