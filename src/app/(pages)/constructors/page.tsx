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
import { getConstructorStandings, getConstructors } from "@/utils/frontend/requests/constructors";

interface ConstructorItem {
  constructor_id: string;
  year: number;
  total_points: string | number;
}

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

const fetchSeasonStandings = async (
  years: [number, number],
  constructors: string[]
) => {
  const datapoints = await getConstructorStandings(years[0], years[1], constructors);

  const { data, uniqueConstructors } = datapoints.reduce((
    acc: any,
    { year, constructor_id, total_points }: ConstructorItem
  ) => {
    const dataRow = acc.data[year] || {}
    return {
      encountered: acc.encountered[constructor_id]
        ? acc.encountered
        : { ...acc.encountered, [constructor_id]: true },
      uniqueConstructors: acc.encountered[constructor_id]
        ? acc.uniqueConstructors
        : acc.uniqueConstructors.concat(constructor_id),
      data: { ...acc.data, [year]: { ...dataRow, [constructor_id]: Number(total_points) } }
    }
  }, {
    encountered: {},
    uniqueConstructors: [],
    data: {}
  });

  return {
    data: Object.keys(data).map((key: string) => ({ ...data[key], year: key })),
    uniqueConstructors
  };
}

const stateWithDatapoints = async (state: ReducerState) => {
  const { data, uniqueConstructors } = await fetchSeasonStandings(state.years, state.selectedConstructors);
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
      const data = state.datapoints.find((entry: any) => entry.year === axisValue);

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
    const constructorName: string = state.allConstructors[index];

    const constructorData = state.datapoints
      .filter((entry: any) => entry[constructorName] !== undefined && entry[constructorName] !== null)
      .map((entry: any) => ({
        year: entry.year,
        points: entry[constructorName],
      }));

    const constructorColor = constructorName in constructorColors
      ? constructorColors[constructorName as keyof typeof constructorColors]
      : '#888';

    const constructorList = constructorData.reverse();
    const firstColumn = constructorList.slice(0, 20)
    const secondColumn = constructorList.slice(20, 40)
    const thirdColumn = constructorList.slice(40, 60)
    const fourthColumn = constructorList.slice(60, constructorList.length)

    return (
      <Paper sx={{ padding: 2, backgroundColor: '#252525', color: '#ffffff' }}>
        <p style={{ textAlign: 'center' }} >{labelizeKey(constructorName)}</p>
        <hr style={{ height: '1px', marginBottom: '2px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: (constructorList.length > 20 ? (constructorList.length > 40 ? (constructorList.length > 60 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr') : '1fr 1fr') : '1fr'), gap: '10px' }} >
          <div>
            {firstColumn.map((entry: any, i: number) => {
              const isCurrentYear = entry.year === axisValue;
              return (
                <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentYear ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                  {`${entry.year}: ${entry.points} pts`}
                </p>
              );
            })}
          </div>
          {
            constructorList.length > 20 && (
              <div>
                {secondColumn.map((entry: any, i: number) => {
                  const isCurrentYear = entry.year === axisValue;
                  return (
                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentYear ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                      {`${entry.year}: ${entry.points} pts`}
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
                  const isCurrentYear = entry.year === axisValue;
                  return (
                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentYear ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                      {`${entry.year}: ${entry.points} pts`}
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
                  const isCurrentYear = entry.year === axisValue;
                  return (
                    <p key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrentYear ? constructorColor : 'transparent', marginRight: 5, marginTop: 2, }} />
                      {`${entry.year}: ${entry.points} pts`}
                    </p>
                  );
                })}
              </div>
            )
          }
        </div>
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
                  xAxis={[{ dataKey: "year", scaleType: "point", position: "bottom" }]}
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