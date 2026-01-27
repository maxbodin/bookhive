"use client";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useYearSelection } from "@/app/contexts/year-selection-context";

export function YearSelection() {
  const t = useTranslations( "Stats.YearSelection" );
  const { availableYears, selectedYear, setSelectedYear } = useYearSelection();

  const handleValueChange = ( yearString: string ) => {
    setSelectedYear( Number( yearString ) );
  };

  if (availableYears.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={ String( selectedYear ) }
        onValueChange={ handleValueChange }
      >
        <SelectTrigger
          className="ml-auto h-8 w-[120px] rounded-lg pl-2.5 text-xs"
          aria-label={ t( "ariaLabel" ) }
        >
          <SelectValue placeholder={ t( "placeholder" ) }/>
        </SelectTrigger>
        <SelectContent align="end" className="rounded-xl">
          { availableYears.map( ( year ) => (
            <SelectItem key={ year } value={ String( year ) } className="rounded-lg h-8">
              <div className="flex items-center gap-2 text-xs">{ year }</div>
            </SelectItem>
          ) ) }
        </SelectContent>
      </Select>
    </div>
  );
}