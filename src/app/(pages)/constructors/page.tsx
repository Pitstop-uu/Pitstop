"use client"

import "@/styles/constructors.css";
import Header from "@/components/Header";
import { useEffect, useCallback, useReducer, useState } from "react";
import { LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { HighlightItemData } from "@mui/x-charts/context";
import Paper from "@mui/material/Paper";

import { constructorColors } from '@/components/ui/ConstructorColors.ts';
import ConstructorDropDownFilterMultiple from "@/components/ConstructorDropDownFilterMultiple";
import DropDownFilterInterval from '@/components/FilterInterval';
import CustomLegend from "@/components/CustomLegend";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { getConstructorStandings, getConstructors, getConstructorRaceStandings } from "@/utils/frontend/constructorPage/requests";
import { parseConstructorRaceStandings, parseConstructorSeasonStandings } from "@/utils/frontend/constructorPage/parsers";

export type ConstructorResult = {
  year: number;
  [key: string]: number;
}

interface ReducerState {
  years: [number, number],
  datapoints: ConstructorResult[],
  selectableConstructors: { key: string, value: string }[],
  selectedConstructors: string[],
  loading: boolean,
}

const fetchConstructors = async (years: [number, number]) => {
  return (await getConstructors(years[0], years[1]))
    .map((constructor: any) => ({ key: constructor.id, value: labelizeKey(constructor.id) }));
}

const fetchStandings = async (
  years: [number, number],
  constructors: string[]
) => {
  const datapoints = years[0] === years[1]
    ? parseConstructorRaceStandings(await getConstructorRaceStandings(years[0], constructors))
    : parseConstructorSeasonStandings(await getConstructorStandings(years[0], years[1], constructors));

  const { data, uniqueConstructors } = datapoints.reduce((
    acc: any,
    { key, constructor_id, value }: any
  ) => {
    const dataRow = acc.data[key] || {}
    return {
      encountered: acc.encountered[constructor_id]
        ? acc.encountered
        : { ...acc.encountered, [constructor_id]: true },
      uniqueConstructors: acc.encountered[constructor_id]
        ? acc.uniqueConstructors
        : acc.uniqueConstructors.concat(constructor_id),
      data: { ...acc.data, [key]: { ...dataRow, [constructor_id]: Number(value) } }
    }
  }, {
    encountered: {},
    uniqueConstructors: [],
    data: {}
  });
  
  return {
    data: Object.keys(data).map((key: string) => ({ ...data[key], key })),
    uniqueConstructors
  };
}

const stateWithDatapoints = async (state: ReducerState) => {
  const { data, uniqueConstructors } = await fetchStandings(state.years, state.selectedConstructors);
  return { ...state, datapoints: data, allConstructors: uniqueConstructors };
}

const stateWithSelectableConstructors = async (state: ReducerState) => {
  const selectableConstructors = await fetchConstructors(state.years);
  return { ...state, selectableConstructors: selectableConstructors };
}

const stateWithAll = async (state: ReducerState) => {
  return await stateWithSelectableConstructors(await stateWithDatapoints(state));
}

const initialState = {
  years: [2020, 2024],
  datapoints: [],
  selectableConstructors: [],
  selectedConstructors: [],
  allConstructors: [],
  loading: false,
} as ReducerState;

const reducer = (state: ReducerState, action: { type: string, payload: any }) => {
  const { type } = action;
  switch (type) {
    case "set":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function ConstructorsPage() {
  const [state, dispatch] = useReducer(reducer, { ...initialState });
  const [highlightedItem, setHighLightedItem] = useState<HighlightItemData | null>(null);

  useEffect(() => {
    const setInitialState = async () => {
      const initState = await stateWithAll(initialState);
      dispatch({ type: "set", payload: initState });
    }
    setInitialState();
  }, []);

  const onSetInterval = useCallback(async (currentState: ReducerState, years: [number, number]) => {
    const withAll = await stateWithAll({ ...currentState, years, selectedConstructors: [] });
    dispatch({ type: "set", payload: withAll });
  }, []);

  const onSetSelected = useCallback(async (currentState: ReducerState, constructors: string[]) => {
    const withDatapoints = await stateWithDatapoints({ ...currentState, selectedConstructors: constructors });
    dispatch({ type: "set", payload: withDatapoints });
  }, [])

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
      const data = state.datapoints.find((entry: any) => entry.key === axisValue);

      if (!data) {
        return null;
      }

      const { key, ...rest } = data;

      return (
        <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
          <p style={{ textAlign: 'center' }} >{key}</p>
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
    const constructorName: string = state.allConstructors[index];

    const constructorData = state.datapoints
      .filter((entry: any) => entry[constructorName] !== undefined && entry[constructorName] !== null)
      .map((entry: any) => ({
        year: entry.key,
        points: entry[constructorName],
      }));

    const constructorColor = constructorName in constructorColors
      ? constructorColors[constructorName as keyof typeof constructorColors]
      : '#888';

    return (
      <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
        <p style={{ textAlign: 'center' }} >{labelizeKey(constructorName)}</p>
        <hr style={{ height: '1px', marginBottom: '2px' }} />
        {constructorData.reverse().map((entry: any, i: number) => {
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

        <div className="ml-12 mt-10">
          <DropDownFilterInterval
            interval={state.years}
            setInterval={(interval: number[]) => {
              onSetInterval(state, [interval[0], interval[1]]);
            }}
          />

          <ConstructorDropDownFilterMultiple
            selectableConstructors={state.selectableConstructors}
            selectedConstructors={state.selectedConstructors}
            setSelectedConstructors={(constructors: string[]) => {
              onSetSelected(state, constructors);
            }}
          />
        </div>

        {
          !state.loading && (
            <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <div style={{ flex: "1", minHeight: "400px" }}>
                <LineChart
                  dataset={state.datapoints}
                  xAxis={[{ dataKey: "key", scaleType: "point", position: "bottom" }]}
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
                    bottom: 30,
                    left: 100,
                    right: 100,
                  }}
                  height={500}
                  highlightedItem={highlightedItem}
                  onHighlightChange={setHighLightedItem}
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
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLegend
                  constructors={state.datapoints}
                />
              </div>
            </div>
          )
        }
      </div>
    </section>
  );
}