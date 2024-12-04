import * as React from "react";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { axisClasses, chartsGridClasses, BarChart, lineElementClasses, markElementClasses, HighlightItemData } from "@mui/x-charts";
import { constructorColors } from "./ui/ConstructorColors";

interface CustomBarChartProps {
    datapoints: any,
    CustomTooltip: any,
    CustomTooltipHighlight: any,
    allDrivers: any,
    years: any,
};

export default function CustomBarChart({
    datapoints,
    CustomTooltip,
    CustomTooltipHighlight,
    allDrivers,
    years,
}: CustomBarChartProps) {

    const [highlightedItem, setHighlightedItem] = React.useState<HighlightItemData | null>(null);

    const CustomTooltipContent = (props: any) => {
        const { axisValue } = props;
        if (!highlightedItem) {
            return (
                <CustomTooltip axisValue={axisValue} />
            );
        };
        return (
            <CustomTooltipHighlight highlightedItem={highlightedItem} axisValue={axisValue} />
        );
    };

    return (

        <BarChart
            dataset={datapoints}
            xAxis={[allDrivers.length
                ? {
                    dataKey: "key",
                    scaleType: "band",
                    position: "bottom",
                    valueFormatter: (key) =>
                        `${labelizeKey(key)}`,
                }
                : {
                    data: Array.from({ length: years[1] - years[0] + 1 }, (v, i) => i + years[0]),
                    scaleType: "band",
                }
            ]}
            yAxis={[allDrivers.length ? { min: 0 } : { min: 0, max: 600 }]}
            axisHighlight={{ x: 'band' }}
            tooltip={{ trigger: 'axis', axisContent: CustomTooltipContent }}
            height={480}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighlightedItem}
            grid={{ vertical: true, horizontal: true }}
            slotProps={{
                legend: {
                    hidden: true,
                },
                noDataOverlay: {
                    message: 'No drivers to display',
                    style: { fill: 'white' }
                },
            }}
            sx={() => ({
                [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'white',
                        strokeWidth: 3,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                        fill: 'white',
                    },
                },
                [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                    strokeWidth: 4,
                },
                [`.${chartsGridClasses.line}`]: {
                    strokeDasharray: '5 3',
                    strokeWidth: 1,
                    stroke: 'rgba(255, 255, 255, 0.12)',
                },
            })}
            series={allDrivers.map((driver: any) => {
                const constructorColor = driver.constructor in constructorColors
                    ? constructorColors[driver.constructor as keyof typeof constructorColors]
                    : '#888';

                return {
                    dataKey: driver.driver,
                    label: labelizeKey(String(driver.driver)),
                    color: constructorColor,
                    curve: 'linear',
                    showMark: false,
                    highlightScope: { highlight: 'item', fade: 'global' },
                };
            })}
            margin={{
                bottom: years[0] === years[1] ? 80 : 30,
                left: 100,
                right: 100,
            }}
            bottomAxis={{
                tickLabelStyle: {
                    angle: years[0] === years[1] ? 35 : 0,
                    textAnchor: years[0] === years[1] ? 'start' : 'middle',
                }
            }}
        />

    );
};