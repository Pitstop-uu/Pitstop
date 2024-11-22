"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface DropDownFilterIntervalProps {
  interval: number[];
  setInterval: (selected:number[]) => void;
}

export default function DropDownFilterInterval({interval, setInterval}: DropDownFilterIntervalProps) {
  const [fromYear, setFromYear] = React.useState<number | null>(null)
  const [toYear, setToYear] = React.useState<number | null>(null)
  const minYear = 1950;
  const maxYear = 2024;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)

  const handleYearSelection = (type: "FROM" | "TO", year: number) => {
    const [fromYear, toYear] = interval;
    if (type === "FROM") {
      const updatedFromYear = year;
      setInterval([updatedFromYear, Math.max(toYear, updatedFromYear)]);
    } else if (type === "TO") {
      const updatedToYear = year;
      setInterval([Math.min(fromYear, updatedToYear), updatedToYear]);
    }
  };

  return (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hover:bg-[#252525]">TIMEFRAME: {interval[0]}-{interval[1]} <span className="rotate-90 ml-48">&gt;</span></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 max-h-60 overflow-y-auto grid grid-cols-2 gap-4 bg-[#252525]">
              <div className="flex flex-col">
                <p className="font-semibold mb-2">FROM:</p>
                {years.map((year) => (
                  <DropdownMenuCheckboxItem
                    key={`from-${year}`}
                    checked={interval[0] === year}
                    onCheckedChange={(checked) => checked && handleYearSelection("FROM", year)}
                  >
                    {year}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold mb-2">TO:</p>
                {years.map((year) => (
                  <DropdownMenuCheckboxItem
                    key={`to-${year}`}
                    checked={interval[1] === year}
                    disabled={year < interval[0]}
                    onCheckedChange={(checked) => checked && handleYearSelection("TO", year)}
                  >
                    {year}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
  );
}
