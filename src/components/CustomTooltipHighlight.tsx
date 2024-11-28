import labelizeKey from "@/utils/frontend/labelizeKey";
import * as React from "react"
import Paper from "@mui/material/Paper";
import { HighlightItemData } from "@mui/x-charts";
import { constructorColors } from "./ui/ConstructorColors";

interface CustomTooltipHighlightProps {
    highlightedItem: HighlightItemData,
    axisValue: any,
    datapoints: { 
        key: any,
        [prop: string]: number
    }[],
    allConstructors: string[],
    latestConstructorIdMap: { [key: string]: string },
};

export default function CustomTooltipHighlight({ highlightedItem, axisValue, datapoints, allConstructors, latestConstructorIdMap }: CustomTooltipHighlightProps) {

    const { seriesId } = highlightedItem;
    const index = Number(String(seriesId).match(/\d+/g));
    const constructorName: string = allConstructors[index];

    const constructorData = datapoints
      .filter((entry: any) => entry[constructorName] !== undefined && entry[constructorName] !== null)
      .map((entry: any) => ({
        key: entry.key,
        points: entry[constructorName],
      }));

    const constructorColor = constructorName in constructorColors
      ? constructorColors[constructorName as keyof typeof constructorColors]
      : '#888';

    const constructorList = constructorData.reverse();
    const firstColumn = constructorList.slice(0, 22)
    const secondColumn = constructorList.slice(22, 44)
    const thirdColumn = constructorList.slice(44, 66)
    const fourthColumn = constructorList.slice(66, constructorList.length)

    return (
        <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
            <p style={{ textAlign: 'center' }} >{constructorName === latestConstructorIdMap[constructorName] ? labelizeKey(constructorName) : <>{labelizeKey(constructorName)}<br />({labelizeKey(String(latestConstructorIdMap[constructorName]))})</>}</p>
            <hr style={{ height: '1px', marginBottom: '2px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: (constructorList.length > 22 ? (constructorList.length > 44 ? (constructorList.length > 66 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr') : '1fr 1fr') : '1fr'), gap: '10px' }} >
                <div>
                    {firstColumn.map((entry: any, i: number) => {
                        const isCurrentKey = entry.key === axisValue;
                        return (
                            <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                {`${labelizeKey(entry.key)}: ${entry.points} pts`}
                            </p>
                        );
                    })}
                </div>
                {
                    constructorList.length > 20 && (
                        <div>
                            {secondColumn.map((entry: any, i: number) => {
                                const isCurrentKey = entry.key === axisValue;
                                return (
                                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                        {`${labelizeKey(entry.key)}: ${entry.points} pts`}
                                    </p>
                                );
                            })}
                        </div>
                    )
                }
                {
                    constructorList.length > 40 && (
                        <div>
                            {thirdColumn.map((entry: any, i: number) => {
                                const isCurrentKey = entry.key === axisValue;
                                return (
                                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                        {`${labelizeKey(entry.key)}: ${entry.points} pts`}
                                    </p>
                                );
                            })}
                        </div>
                    )
                }
                {
                    constructorList.length > 60 && (
                        <div>
                            {fourthColumn.map((entry: any, i: number) => {
                                const isCurrentKey = entry.key === axisValue;
                                return (
                                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentKey ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                                        {`${labelizeKey(entry.key)}: ${entry.points} pts`}
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