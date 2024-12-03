"use client"

import "@/styles/constructors.css";
import Header from "@/components/Header";
import { useEffect, useCallback, useReducer } from "react";

import ConstructorDropDownFilterMultiple from "@/components/ConstructorDropDownFilterMultiple";
import CustomLegend from "@/components/CustomLegend";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { parseDriverSeasonStandings } from "@/utils/frontend/driverPage/parsers";
import { getDriverSeasonStandings, getDrivers } from "@/utils/frontend/driverPage/requests";
import DropDownSelector from "@/components/DropDownSelector";
import { constructorColors } from "@/components/ui/ConstructorColors";
import { axisClasses, BarChart, chartsGridClasses, HighlightItemData, lineElementClasses, markElementClasses } from "@mui/x-charts";
import React from "react";
import CustomBarTooltip from "@/components/CustomBarTooltip";
import CustomBarTooltipHighlight from "@/components/CustomBarTooltipHighlight";
import "@/styles/page.css";
import DriverDropDownFilterMultiple from "@/components/DriverDropDownFilterMultiple";

export type ConstructorResult = {
  year: number;
  [key: string]: number;
}

interface ReducerState {
  years: [number, number],
  datapoints: ConstructorResult[],
  selectableDrivers: { key: string, value: string }[],
  selectedDrivers: string[],
  driverConstructors: {
    [driver: string]: { [year: string]: string }
  },
  allDrivers: { driver: string, constructor: string }[],
  loading: boolean,
}

const fetchDrivers = async (years: [number, number]) => {
  return (await getDrivers(years[0], years[1]))
    .map((constructor: any) => ({ key: constructor.id, value: labelizeKey(constructor.id) }));
}

const fetchStandings = async (
  years: [number, number],
  drivers: string[]
) => {
  const datapoints = parseDriverSeasonStandings(await getDriverSeasonStandings(years[0], years[1], drivers));

  const { data, encountered, driverConstructorMap } = datapoints.reduce((
    acc: any,
    { key, driver_id, constructor_id, value }: any
  ) => {
    const dataRow = acc.data[key] || {}
    const driverConstructorObject = acc.driverConstructorMap[driver_id] || {};
    const latestDriver = acc.encountered[driver_id];
    const newDriver = (latestDriver?.key || 0) < key
      ? { key, driver_id, constructor_id }
      : latestDriver
    
    return {
      encountered: { ...acc.encountered, [driver_id]: newDriver },
      data: { ...acc.data, [key]: { ...dataRow, [driver_id]: Number(value) } },
      driverConstructorMap: {
        ...acc.driverConstructorMap,
        [driver_id]: { ...driverConstructorObject, [key]: constructor_id }
      }
    }
  }, {
    encountered: {},
    driverConstructorMap: {},
    data: {}
  });

  return {  
    data: Object.keys(data).map((key: string) => ({ ...data[key], key })),
    uniqueDrivers: Object.keys(encountered).map((driver: string) => ({ driver, constructor: encountered[driver].constructor_id })),
    driverConstructorMap
  };
}


const stateWithDatapoints = async (state: ReducerState) => {
  const { data, uniqueDrivers, driverConstructorMap } = await fetchStandings(state.years, state.selectedDrivers);
  return { ...state, datapoints: data, allDrivers: uniqueDrivers, driverConstructors: driverConstructorMap };
}

const stateWithSelectableDrivers = async (state: ReducerState) => {
  const selectableDrivers = await fetchDrivers(state.years);
  return {
    ...state,
    selectableDrivers
  };
}

const stateWithAll = async (state: ReducerState) => {
  return await stateWithSelectableDrivers(await stateWithDatapoints(state));
}

const initialState = {
  years: [2020, 2024],
  datapoints: [],
  selectableDrivers: [],
  selectedDrivers: [],
  allDrivers: [],
  driverConstructors: {},
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

export default function DriversPage() {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    const setInitialState = async () => {
      const initState = await stateWithAll(initialState);
      dispatch({ type: "set", payload: initState });
    }
    setInitialState();
  }, []);

  const onSetInterval = useCallback(async (currentState: ReducerState, years: [number, number]) => {
    const withAll = await stateWithAll({ ...currentState, years, selectedDrivers: [] });
    dispatch({ type: "set", payload: withAll });
  }, []);

  const onSetSelected = useCallback(async (currentState: ReducerState, drivers: string[]) => {
    const withDatapoints = await stateWithDatapoints({ ...currentState, selectedDrivers: drivers });
    dispatch({ type: "set", payload: withDatapoints });
  }, []);

  const Tooltip = (props: any) => {
    const data = state.datapoints.find((entry: any) => entry.key === props.axisValue);
    return <CustomBarTooltip drivers={data} allDrivers={state.allDrivers} />
  }
  
  const TooltipHighlight = (props: any) => {
    return <CustomBarTooltipHighlight
      highlightedItem={props.highlightedItem}
      axisValue={props.axisValue}
      datapoints={state.datapoints}
      allDrivers={state.allDrivers}
      driverConstructors={state.driverConstructors}
    />
  }

  const [highlightedItem, setHighlightedItem] = React.useState<HighlightItemData | null>(null);
  
  const CustomTooltipContent = (props: any) => {
    const { axisValue } = props;
    if (!highlightedItem) {
      return (
        <Tooltip axisValue={axisValue} />
      );
    };
    return (
      <TooltipHighlight highlightedItem={highlightedItem} axisValue={axisValue} />
    );
  };

  return (
    <section className="bg-black">
      <div className="container-drivers container-page" style={{ color: "white", backgroundColor: "black" }}>
        <Header />

        <div className="ml-12 mt-10 flex gap-10">
          <DropDownSelector
            interval={state.years}
            setInterval={(interval: number[]) => {
              onSetInterval(state, [interval[0], interval[1]]);
            }}
          />

          <DriverDropDownFilterMultiple
            selectableDrivers={state.selectableDrivers}
            selectedDrivers={state.selectedDrivers}
            setSelectedDrivers={(drivers: string[]) => {
              onSetSelected(state, drivers);
            }}
          />
        </div>
        {
          !state.loading && (
            <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <div style={{ minHeight: "300px" }}>
                <BarChart
                  dataset={state.datapoints}
                  xAxis={[{
                    dataKey: "key",
                    scaleType: "band",
                    position: "bottom",
                    valueFormatter: (key, _) =>
                      `${labelizeKey(key)}`,
                  }]}
                  yAxis={[{ min: 0 }]}
                  axisHighlight={{ x: 'band' }}
                  tooltip={{ trigger: 'axis', axisContent: CustomTooltipContent }}
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
                  series={state.allDrivers.map((driver: any) => {
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
                    bottom: state.years[0] === state.years[1] ? 80 : 30,
                    left: 100,
                    right: 100,
                  }}
                  bottomAxis={{
                    tickLabelStyle: {
                      angle: state.years[0] === state.years[1] ? 35 : 0,
                      textAnchor: state.years[0] === state.years[1] ? 'start' : 'middle',
                    }
                  }}
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
                  latestConstructorIdMap={{}}
                  allDrivers={state.allDrivers}
                />
              </div>
            </div>
          )
        }
      </div>
    </section>
  );
}