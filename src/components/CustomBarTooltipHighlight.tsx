import labelizeKey from "@/utils/frontend/labelizeKey";
import * as React from "react"
import Paper from "@mui/material/Paper";
import { HighlightItemData } from "@mui/x-charts";
import { constructorColors } from "./ui/ConstructorColors";

interface CustomBarTooltipHighlightProps {
    highlightedItem: HighlightItemData,
    axisValue: any,
    datapoints: { 
        key: any,
        [prop: string]: number
    }[],
    allDrivers: {
        driver: string,
        constructor: string,
    }[],
    driverConstructors: {
        [driver: string]: { [year: string]: string }
    }
};

export default function CustomTooltipHighlight({ highlightedItem, axisValue, datapoints, allDrivers, driverConstructors }: CustomBarTooltipHighlightProps) {

    const { seriesId } = highlightedItem;
    const index = Number(String(seriesId).match(/\d+/g));
    const driverName: string = allDrivers[index].driver;

    const driverData = datapoints
      .filter((entry: any) => entry[driverName] !== undefined && entry[driverName] !== null)
      .map((entry: any) => ({
        key: entry.key,
        points: entry[driverName],
    }));

    const driver = allDrivers.find(({driver}: { driver: string, constructor: string }) => driver === driverName) || { driver: '', constructor: '' }

    const constructorColor = String(driver.constructor) in constructorColors
      ? constructorColors[driver.constructor as keyof typeof constructorColors]
      : '#888';

    const driverList = driverData.reverse();
    const firstColumn = driverList.slice(0, 22)
    const secondColumn = driverList.slice(22, 44)
    const thirdColumn = driverList.slice(44, 66)
    const fourthColumn = driverList.slice(66, driverList.length)

    return (
        <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
            <p style={{ textAlign: 'center' }} >{labelizeKey(driverName)}</p>
            <hr style={{ height: '1px', marginBottom: '2px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: (driverList.length > 22 ? (driverList.length > 44 ? (driverList.length > 66 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr') : '1fr 1fr') : '1fr'), gap: '10px' }} >
                <div>
                    {firstColumn.map((entry: any, i: number) => {
                        const isCurrentKey = entry.key === axisValue;
                        return (
                            <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                {`${labelizeKey(entry.key)} (${labelizeKey(driverConstructors[driverName][entry.key])}): ${entry.points} pts`}
                            </p>
                        );
                    })}
                </div>
                {
                    driverList.length > 20 && (
                        <div>
                            {secondColumn.map((entry: any, i: number) => {
                                const isCurrentKey = entry.key === axisValue;
                                return (
                                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                        {`${labelizeKey(entry.key)} (${labelizeKey(driverConstructors[driverName][entry.key])}): ${entry.points} pts`}
                                    </p>
                                );
                            })}
                        </div>
                    )
                }
                {
                    driverList.length > 40 && (
                        <div>
                            {thirdColumn.map((entry: any, i: number) => {
                                const isCurrentKey = entry.key === axisValue;
                                return (
                                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                        {`${labelizeKey(entry.key)} (${labelizeKey(driverConstructors[driverName][entry.key])}): ${entry.points} pts`}
                                    </p>
                                );
                            })}
                        </div>
                    )
                }
                {
                    driverList.length > 60 && (
                        <div>
                            {fourthColumn.map((entry: any, i: number) => {
                                const isCurrentKey = entry.key === axisValue;
                                return (
                                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                        {`${labelizeKey(entry.key)} (${labelizeKey(driverConstructors[driverName][entry.key])}): ${entry.points} pts`}
                                    </p>
                                );
                            })}
                        </div>
                    )
                }
            </div>  
        </Paper>
    );
}