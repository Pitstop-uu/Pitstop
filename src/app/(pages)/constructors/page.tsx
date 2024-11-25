"use client"

import "@/styles/constructors.css";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { HighlightItemData } from "@mui/x-charts/context";
import Paper from "@mui/material/Paper";

import { constructorColors } from '@/components/ui/ConstructorColors.ts';
import { DropdownMenuMultiple } from "@/components/DropDownFilterMultiple";
import DropDownFilterInterval from '@/components/DropDownFilterInterval';
import labelizeKey from "@/utils/frontend/labelizeKey";
import { getConstructorStandings, getConstructors } from "@/utils/frontend/requests/constructors";

interface ConstructorItem {
  constructor_id: string;
  year: number;
  total_points: string | number;
}

type ConstructorResult = {
  year: number;
  [key: string]: number;
}

export default function ConstructorsPage() {
  const [years, setYears] = useState([2020, 2024]);
  const [allConstructors, setAllConstructors] = useState<string[]>([]);
  const [datapoints, setDatapoints] = useState<ConstructorResult[]>([]); // TODO: Rename to datapunkt eller nåt
  const [selectableConstructors, setSelectableConstructors] = useState([]);
  const [selectedConstructors, setSelectedConstructors] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [highlightedItem, setHighLightedItem] = useState<HighlightItemData | null>(null);

  useEffect(() => {
    const fetchConstructors = async () => {
      const constructorList = (await getConstructors(years[0], years[1]))
          .map((constructor: any) => ({ key: constructor.id, value: labelizeKey(constructor.id) }));
      setSelectableConstructors(constructorList);
  }
  fetchConstructors();
  }, [years])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const constructors = selectedConstructors
        .filter(c => selectableConstructors.find((s: any) => s.key === c));
      const fetchedDatapoints = await getConstructorStandings(years[0], years[1], constructors);

      const constructorList: string[] = [];
      const transformedData = fetchedDatapoints.reduce((acc: ConstructorResult[], { year, constructor_id, total_points }: ConstructorItem) => {
        if (!constructorList.find((c_id) => c_id === constructor_id)) {
          constructorList.push(constructor_id);
        }
        const yearEntry = acc.find((entry) => entry.year === year);
        if (yearEntry) {
          yearEntry[constructor_id] = Number(total_points);
        } else {
          acc.push({ year, [constructor_id]: Number(total_points) });
        }
        return acc;
      }, []);

      setAllConstructors(constructorList)
      setDatapoints(transformedData);
      setLoading(false);
    }
    fetchData();
  }, [years, selectedConstructors, selectableConstructors]);

  /**
   * Custom Tooltip Component for rendering data in a tooltip.
   * 
   * This component renders a custom tooltip that displays key-value pairs for 
   * a specific year, with special formatting for certain keys. The `year` key 
   * is displayed separately with centered text, while the rest of the keys are 
   * shown in descending order.
   * 
   * @param {Object} props - The component's props.
   * @param {string} props.axisValue - The year value used to retrieve the corresponding data.
   * 
   * @returns {JSX.Element | null} - Returns a Paper component containing the tooltip content,
   *                                  or `null` if no data is found for the specified year.
   * 
   * @example
   * // When year is "2022"
   * <CustomTooltipContent axisValue="2022" />
   */
  const CustomTooltipContent = (props: any) => {
    const { axisValue } = props;

    if (!highlightedItem) {
      const data = datapoints.find((entry) => entry.year === axisValue);

      if (!data) {
        return null;
      }

      const { year, ...rest } = data;

      return (
        <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
          <p style={{ textAlign: 'center' }} >{year}</p>
          <hr style={{ height: '1px', marginBottom: '2px' }} />
          {
            Object.entries(rest)
              .sort(([, a], [, b]) => Number(b) - Number(a))
              .map(([key, value], i) => {
                const labelizedKey = labelizeKey(key)

                const constructorColor = key in constructorColors
                  ? constructorColors[key as keyof typeof constructorColors]
                  : '#888';

                return (
                  <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: constructorColor, marginRight: 5, marginTop: 2, }} />
                    {`${labelizedKey}: ${value} pts`}
                  </p>
                )
              }
              )}
        </Paper>
      );
    };

    const { seriesId } = highlightedItem;
    const index = Number(String(seriesId).match(/\d+/g));
    const constructorName: string = allConstructors[index];

    const constructorData = datapoints
      .filter(entry => entry[constructorName] !== undefined && entry[constructorName] !== null)
      .map(entry => ({
        year: entry.year,
        points: entry[constructorName],
      }));

    const constructorColor = constructorName in constructorColors
      ? constructorColors[constructorName as keyof typeof constructorColors]
      : '#888';

    return (
      <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
        <p style={{ textAlign: 'center' }} >{labelizeKey(constructorName)}</p>
        <hr style={{ height: '1px', marginBottom: '2px' }} />
        {constructorData.reverse().map((entry, i) => {
          const isCurrentYear = entry.year === axisValue;
          return (
            <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentYear ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
              {`${entry.year}: ${entry.points} pts`}
            </p>
          );
        })}
      </Paper>
    );
  };

  return (
    <section>
      <div className="container-constructors container-page" style={{ color: "white" }}>
        <Header />
        
        <div className="ml-12 mt-20">
          <DropDownFilterInterval
            interval={years}
            setInterval={setYears}
          />

          <DropdownMenuMultiple
            list={selectableConstructors}
            title={"SELECT CONSTRUCTORS"}
            selected={selectedConstructors}
            setSelected={setSelectedConstructors}
          />
        </div>

        {
          !loading && (
            <LineChart
              dataset={datapoints}
              xAxis={[{ dataKey: "year", scaleType: "point", position: "bottom" }]}
              yAxis={[{ min: 0 }]}
              series={allConstructors.map((constructor) => {

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
              height={600}
              margin={{ bottom: 120 }}
              highlightedItem={highlightedItem}
              onHighlightChange={setHighLightedItem}
              grid={{ vertical: true, horizontal: true }}
              slotProps={{
                legend: {
                  position: {
                    vertical: 'bottom',
                    horizontal: 'middle',
                  },
                  labelStyle: {
                    fontSize: 16,
                    fill: 'white',
                  },
                  itemMarkWidth: 24,
                  itemMarkHeight: 3,
                  markGap: 10,
                  itemGap: 20,
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
          )
        }

      </div>

    </section>
  );
}