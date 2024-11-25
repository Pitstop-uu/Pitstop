"use client"

import React from "react";
import { DropdownMenuMultiple } from "./DropDownFilterMultiple";
import labelizeKey from "@/utils/frontend/labelizeKey";

interface ConstructorDropDownFilterMultipleProps {
    selectableConstructors: { key: string, value: string}[];
    selectedConstructors: string[];
    setSelectedConstructors: (selected: string[]) => void;
}

export default function ConstructorDropDownFilterMultiple({
    selectableConstructors,
    selectedConstructors,
    setSelectedConstructors
}: ConstructorDropDownFilterMultipleProps) {
    const noneSelected = selectedConstructors.length === 0;

    const limitConstructorNames = (constructorList: string[]): string => {
        let result = "";
        constructorList.forEach(constructor => {
            result += labelizeKey(constructor) + ", ";
        });

        if (result.length > 29) {
            result = result.slice(0, 26) + "..."
        };

        return result;
    }

    return (
        <DropdownMenuMultiple
            list={selectableConstructors}
            title={`SELECT CONSTRUCTORS: ${noneSelected ? "ALL" : limitConstructorNames(selectedConstructors)}`}
            selected={selectedConstructors}
            setSelected={setSelectedConstructors}
        />
    );
}