"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface DropDownFilterMultipleProps {
  list: KeyValue[];
  title?: string;
  selected: string[];
  setSelected: (selected: string[]) => void;
};

type KeyValue = {
  key: string;
  value: string;
}

export function DropdownMenuMultiple({list, title, selected, setSelected}: DropDownFilterMultipleProps){
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hover:bg-[#252525]">{title}: <span className="rotate-90 ml-48">&gt;</span></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-96 max-h-60 overflow-y-auto bg-[#252525] text-white"
      >
        <DropdownMenuLabel>SELECTION METHOD: SPECIFIED</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {list.map(({key, value}) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={selected.find(item => item === key) !== undefined}
            onCheckedChange={(checked) => {
              const newSelected = checked
                ? selected.concat(key)
                : selected.filter(item => item !== key)
              setSelected(newSelected);
            }}
            onSelect={(event) => {
              event.preventDefault()
            }}
          >
            {value}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
