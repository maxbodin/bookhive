import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import React from "react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  isPending?: boolean;
  onPageChange?: ( page: number ) => void;  // State Pagination.
  hrefBuilder?: ( page: number ) => string; // URL Pagination.
}

export function PaginationBar( {
                                 currentPage,
                                 totalPages,
                                 isPending = false,
                                 onPageChange,
                                 hrefBuilder,
                               }: PaginationBarProps ) {
  const t = useTranslations( "PaginationControls" );

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page.
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const renderButton = ( label: string, page: number, disabled: boolean, icon: React.ReactNode ) => {
    if (hrefBuilder) {
      return (
        <Button asChild={ !disabled } variant="outline" size="icon" disabled={ disabled }
                aria-label={ label }>
          <Link href={ hrefBuilder( page ) } aria-label={ label } aria-disabled={ disabled }>
            { icon }
            <span className="sr-only">{ label }</span>
          </Link>
        </Button>
      );
    }

    return (
      <Button
        variant="outline" size="icon"
        onClick={ () => onPageChange?.( page ) }
        disabled={ disabled || isPending }
        aria-label={ label }
      >
        { icon }
        <span className="sr-only">{ label }</span>
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-center gap-4 my-2">
      { renderButton( t( "previousPage" ), currentPage - 1, !hasPrev, <ChevronLeftIcon className="h-4 w-4"/> ) }

      <span className="text-sm font-medium">
        { t( "pageIndicator", {
          currentPage: currentPage,
          totalPages: totalPages,
        } ) }
      </span>

      { renderButton( t( "nextPage" ), currentPage + 1, !hasNext, <ChevronRightIcon className="h-4 w-4"/> ) }
    </div>
  );
}