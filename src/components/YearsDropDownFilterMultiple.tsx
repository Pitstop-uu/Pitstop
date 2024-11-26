"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownMenuMultiple() {
  const [checkedItems, setCheckedItems] = React.useState<{ [key: number]: Checked }>({})

  const baseYears = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 2024 - i)

  const years = [...baseYears].sort((a, b) => {
    const aChecked = checkedItems[a] || false
    const bChecked = checkedItems[b] || false
  
    if (aChecked === bChecked) {
      return b - a 
    }
  
    return aChecked ? -1 : 1 
  })

  const handleCheckedChange = (year: number, checked: Checked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [year]: checked,
    }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">TIMEFRAME</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-96 max-h-60 overflow-y-auto"
      >
        <DropdownMenuLabel>SELECTION METHOD: SPECIFIED</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {years.map((year) => (
          <DropdownMenuCheckboxItem
            key={year}
            checked={checkedItems[year] || false}
            onCheckedChange={(checked) => handleCheckedChange(year, checked)}
            onSelect={(event) => {
              event.preventDefault()
            }}
          >
            {year}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


