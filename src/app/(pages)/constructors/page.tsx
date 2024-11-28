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
import CustomLegend from "@/components/CustomLegend";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { getConstructorStandings, getConstructors, getConstructorRaceStandings, getLatestId } from "@/utils/frontend/constructorPage/requests";
import { parseConstructorRaceStandings, parseConstructorSeasonStandings } from "@/utils/frontend/constructorPage/parsers";
import DropDownSelector from "@/components/DropDownSelector";
import latestConstructorMap from "@/utils/api/latestConstructorMap";
import CustomTooltip from "@/components/CustomTooltip";
import CustomTooltipHighlight from "@/components/CustomTooltipHighlight";

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

const fetchLatestId = async (constructors: string[]) => {
  return (await getLatestId(constructors));
}

const stateWithDatapoints = async (state: ReducerState) => {
  const { data, uniqueConstructors } = await fetchStandings(state.years, state.selectedConstructors);
  return { ...state, datapoints: data, allConstructors: uniqueConstructors };
}

const stateWithSelectableConstructors = async (state: ReducerState) => {
  const selectableConstructors = await fetchConstructors(state.years);
  const selectableConstructorIds = selectableConstructors.map((obj: any) => obj.key);
  const latestConstructorIdMap = await fetchLatestId(selectableConstructorIds);
  return { 
    ...state,
    selectableConstructors,
    latestConstructorIdMap
  };
}

const stateWithAll = async (state: ReducerState) => {
  return await stateWithSelectableConstructors(await stateWithDatapoints(state));
}

const initialState = {
  years: [2020, 2024],
  datapoints: [],
  selectableConstructors: [],
  latestConstructorIdMap: {},
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
};

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

      return (
        <CustomTooltip constructors={data} latestConstructorIdMap={state.latestConstructorIdMap} />
      );
    };
    return (
      <CustomTooltipHighlight highlightedItem={highlightedItem} axisValue={axisValue} datapoints={state.datapoints} allConstructors={state.allConstructors} latestConstructorIdMap={state.latestConstructorIdMap} />
    );
  };

  return (
    <section>
      <div className="container-constructors container-page" style={{ color: "white" }}>
        <Header />

        <div className="ml-12 mt-10 flex gap-10">
          <DropDownSelector
            interval={state.years}
            setInterval={(interval: number[]) => {
              onSetInterval(state, [interval[0], interval[1]]);
            }}
          />

          <ConstructorDropDownFilterMultiple
            selectableConstructors={state.selectableConstructors}
            latestConstructorIdMap={state.latestConstructorIdMap}
            selectedConstructors={state.selectedConstructors}
            setSelectedConstructors={(constructors: string[]) => {
              onSetSelected(state, constructors);
            }}
          />
        </div>

        {
          !state.loading && (
            <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <div style={{ minHeight: "300px" }}>
                <LineChart
                  dataset={state.datapoints}
                  xAxis={[{ 
                    dataKey: "key", 
                    scaleType: "point", 
                    position: "bottom" ,
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
                  latestConstructorIdMap={state.latestConstructorIdMap}
                />
              </div>
            </div>
          )
        }
      </div>
    </section>
  );
}