import * as React from "react";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { axisClasses, chartsGridClasses, HighlightItemData, LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
import { constructorColors } from "./ui/ConstructorColors";
import CustomTooltip from "./CustomTooltip";
import CustomTooltipHighlight from "./CustomTooltipHighlight";

interface CustomLineChartProps {
    state: any;
};

export default function CustomLineChart({ state }: CustomLineChartProps) {
    const [highlightedItem, setHighlightedItem] = React.useState<HighlightItemData | null>(null);

    const CustomTooltipContent = (props: any) => {
        const { axisValue } = props;
        if (!highlightedItem) {
          const data = state.datapoints.find((entry: any) => entry.key === axisValue);
    
          return (
            <CustomTooltip constructors={data} latestConstructorIdMap={state.latestConstructorIdMap} />
          );
        };
        return (
          <CustomTooltipHighlight highlightedItem={highlightedItem} axisValue={axisValue} datapoints={state.datapoints} allConstructors={state.allConstructors} latestConstructorIdMap={state.latestConstructorIdMap} />
        );
      };

    return (
        <LineChart
            dataset={state.datapoints}
            xAxis={[{
                dataKey: "key",
                scaleType: "point",
                position: "bottom",
                valueFormatter: (key, _) =>
                    `${labelizeKey(key)}`,
            }]}
            bottomAxis={{
                tickLabelStyle: {
                    angle: state.years[0] === state.years[1] ? 35 : 0,
                    textAnchor: state.years[0] === state.years[1] ? 'start' : 'middle',
                },
            }}
            yAxis={[{ min: 0 }]}
            series={state.allConstructors.map((constructor: any) => {
                const constructorColor = constructor in constructorColors
                    ? constructorColors[constructor as keyof typeof constructorColors]
                    : '#888';

                return {
                    dataKey: constructor,
                    label: labelizeKey(constructor),
                    color: constructorColor,
                    curve: 'linear',
                    showMark: false,
                    highlightScope: { highlight: 'item', fade: 'global' },
                };
            })}
            tooltip={{ trigger: 'axis', axisContent: CustomTooltipContent }}
            axisHighlight={{ x: 'line' }}
            margin={{
                bottom: state.years[0] === state.years[1] ? 80 : 30,
                left: 100,
                right: 100,
            }}
            height={480}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighlightedItem}
            grid={{ vertical: true, horizontal: true }}
            slotProps={{
                legend: {
                    hidden: true,
                }
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
        />
    );
};