"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: ( values: string[] ) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect( {
                               options,
                               selectedValues,
                               onSelectionChange,
                               placeholder = "Select...",
                               className,
                             }: MultiSelectProps ) {

  const handleToggle = ( value: string ) => {
    const newValues = selectedValues.includes( value )
      ? selectedValues.filter( ( v ) => v !== value )
      : [...selectedValues, value];
    onSelectionChange( newValues );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={ cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ) }
      >
        <span className="text-muted-foreground">
          { selectedValues.length === 0
            ? placeholder
            : `${ selectedValues.length } selected` }
        </span>
        <ChevronDown className="h-4 w-4 opacity-50"/>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[200px]" align="end">
        { options.map( ( option ) => (
          <DropdownMenuCheckboxItem
            key={ option.value }
            checked={ selectedValues.includes( option.value ) }
            onCheckedChange={ () => handleToggle( option.value ) }
            // Prevent dropdown from closing when selecting multiple items.
            onSelect={ ( e ) => e.preventDefault() }
          >
            { option.label }
          </DropdownMenuCheckboxItem>
        ) ) }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}