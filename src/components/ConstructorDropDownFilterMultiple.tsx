"use client"

import React from "react";
import { useState, useEffect } from "react";
import { DropdownMenuMultiple } from "./DropDownFilterMultiple";
import labelizeKey from "@/utils/frontend/labelizeKey";

interface ConstructorDropDownFilterMultipleProps {
    yearFrom: number;
    yearTo: number;
    selectedConstructors: string[];
    setSelectedConstructors: (selected: string[]) => void;
}

export default function ConstructorDropDownFilterMultiple({ yearFrom, yearTo, selectedConstructors, setSelectedConstructors }: ConstructorDropDownFilterMultipleProps) {
    const [constructors, setConstructors] = useState([]);
    const noneSelected = selectedConstructors.length === 0;

    useEffect(() => {
        const fetchConstructors = async () => {
            const response = await window.fetch(`/api/constructors?from=${yearFrom}&to=${yearTo}`);
            const responseJson = await response.json();
            const constructorList = responseJson.data
                .map((constructor: any) => ({ key: constructor.id, value: labelizeKey(constructor.id) }))
            setConstructors(constructorList);
        }
        fetchConstructors();
    }, [yearFrom, yearTo]);

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
            list={constructors}
            title={`SELECT CONSTRUCTORS: ${noneSelected ? "ALL" : limitConstructorNames(selectedConstructors)}`}
            selected={selectedConstructors}
            setSelected={setSelectedConstructors}
        />
    );
}