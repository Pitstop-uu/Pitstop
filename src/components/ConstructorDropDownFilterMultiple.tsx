"use client"

import React from "react";
import { DropdownMenuMultiple } from "./DropDownFilterMultiple";
import labelizeKey from "@/utils/frontend/labelizeKey";

interface ConstructorDropDownFilterMultipleProps {
    selectableConstructors: { key: string, value: string}[];
    latestConstructorIdMap: {[key: string]: string};
    selectedConstructors: string[];
    setSelectedConstructors: (selected: string[]) => void;
}

export default function ConstructorDropDownFilterMultiple({
    selectableConstructors,
    latestConstructorIdMap,
    selectedConstructors,
    setSelectedConstructors
}: ConstructorDropDownFilterMultipleProps) {
    const noneSelected = selectedConstructors.length === 0;

    const limitConstructorNames = (constructorList: string[]): string => {
        let result = "";
        constructorList.forEach(constructor => {
            result += labelizeKey(constructor) + ", ";
        });

        result = result.slice(0, result.length-2);

        if (result.length > 29) {
            result = result.slice(0, 26) + "..."
        };

        return result;
    }

    const list = selectableConstructors.map(({key, value}) => ({
        key,
        value: key === latestConstructorIdMap[key] ? labelizeKey(key) : `${labelizeKey(key)} (${labelizeKey(String(latestConstructorIdMap[key]))})`
    }))

    return (
        <DropdownMenuMultiple
            list={list}
            title={`SELECT CONSTRUCTORS: ${noneSelected ? "ALL" : limitConstructorNames(selectedConstructors)}`}
            selected={selectedConstructors}
            setSelected={setSelectedConstructors}
        />
    );
}