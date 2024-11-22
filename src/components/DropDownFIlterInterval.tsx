"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownMenuInterval() {
  const [fromYear, setFromYear] = React.useState<number | null>(null)
  const [toYear, setToYear] = React.useState<number | null>(null)

  const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 2024 - i)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          TIMEFRAME {fromYear && toYear ? `: ${fromYear} - ${toYear}` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 max-h-60 overflow-y-auto grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <DropdownMenuLabel>FROM</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {years.map((year) => (
            <DropdownMenuCheckboxItem
              key={`from-${year}`}
              checked={fromYear === year}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFromYear(year)
                  // Reset TO year if it conflicts with the new FROM year
                  if (toYear && toYear < year) {
                    setToYear(null)
                  }
                }
              }}
              onSelect={(event) => {
                event.preventDefault()
              }}
            >
              {year}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
        <div className="flex flex-col">
          <DropdownMenuLabel>TO</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {years.map((year) => (
            <DropdownMenuCheckboxItem
              key={`to-${year}`}
              checked={toYear === year}
              disabled={fromYear !== null && year < fromYear} // Disable years before selected FROM year
              onCheckedChange={(checked) => {
                if (checked) {
                  setToYear(year)
                }
              }}
              onSelect={(event) => {
                event.preventDefault()
              }}
            >
              {year}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
