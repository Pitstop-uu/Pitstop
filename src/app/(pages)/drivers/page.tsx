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
import CustomLineChart from "@/components/CustomLineChart";
import { constructorColors } from "@/components/ui/ConstructorColors";
import CustomTooltip from "@/components/CustomTooltip";
import CustomTooltipHighlight from "@/components/CustomTooltipHighlight";

export type ConstructorResult = {
  year: number;
  [key: string]: number;
}

interface ReducerState {
  years: [number, number],
  datapoints: ConstructorResult[],
  selectableDrivers: { key: string, value: string }[],
  selectedDrivers: string[],
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

  const { data, uniqueDrivers } = datapoints.reduce((
    acc: any,
    { key, driver_id, value }: any
  ) => {
    const dataRow = acc.data[key] || {}
    return {
      encountered: acc.encountered[driver_id]
        ? acc.encountered
        : { ...acc.encountered, [driver_id]: true },
      uniqueDrivers: acc.encountered[driver_id]
        ? acc.uniqueDrivers
        : acc.uniqueDrivers.concat(driver_id),
      data: { ...acc.data, [key]: { ...dataRow, [driver_id]: Number(value) } }
    }
  }, {
    encountered: {},
    uniqueDrivers: [],
    data: {}
  });

  return {
    data: Object.keys(data).map((key: string) => ({ ...data[key], key })),
    uniqueDrivers
  };
}


const stateWithDatapoints = async (state: ReducerState) => {
  const { data, uniqueDrivers } = await fetchStandings(state.years, state.selectedDrivers);
  return { ...state, datapoints: data, allDrivers: uniqueDrivers };
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
    return <CustomTooltip constructors={data} latestConstructorIdMap={{}} />
  }

  const TooltipHighlight = (props: any) => {
    return <CustomTooltipHighlight highlightedItem={props.highlightedItem} axisValue={props.axisValue} datapoints={state.datapoints} allConstructors={state.allDrivers} latestConstructorIdMap={{}} />
  }
  
  return (
    <section>
      <div className="container-drivers container-page" style={{ color: "white" }}>
        <Header />

        <div className="ml-12 mt-10 flex gap-10">
          <DropDownSelector
            interval={state.years}
            setInterval={(interval: number[]) => {
              onSetInterval(state, [interval[0], interval[1]]);
            }}
          />

          <ConstructorDropDownFilterMultiple
            selectableConstructors={state.selectableDrivers}
            latestConstructorIdMap={{}}
            selectedConstructors={state.selectedDrivers}
            setSelectedConstructors={(constructors: string[]) => {
              onSetSelected(state, constructors);
            }}
          />
        </div>
        {
          !state.loading && (
            <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <div style={{ minHeight: "300px" }}>
                <CustomLineChart 
                  datapoints={state.datapoints}
                  series={state.allDrivers.map((driver: any) => {
                    /* const constructorColor = driver in constructorColors
                        ? constructorColors[driver as keyof typeof constructorColors]
                        : '#888'; */
    
                    return {
                        dataKey: driver,
                        label: labelizeKey(driver),
                        /* color: constructorColor, */
                        curve: 'linear',
                        showMark: false,
                        highlightScope: { highlight: 'item', fade: 'global' },
                    };
                  })}
                  CustomTooltip={Tooltip}
                  CustomTooltipHighlight={TooltipHighlight}
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
                />
              </div>
            </div>
          )
        }
      </div>
    </section>
  );
}