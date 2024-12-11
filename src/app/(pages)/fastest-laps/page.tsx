"use client"

import "@/styles/constructors.css";
import Header from "@/components/Header";
import { useEffect, useCallback, useReducer } from "react";

import CustomLegend from "@/components/CustomLegend";
import labelizeKey from "@/utils/frontend/labelizeKey";
import DropDownSelector from "@/components/DropDownSelector";
import React from "react";
import CustomBarTooltip from "@/components/CustomBarTooltip";
import CustomBarTooltipHighlight from "@/components/CustomBarTooltipHighlight";
import "@/styles/page.css";
import "@/styles/drivers.css";
import CustomBarChart from "@/components/CustomBarChart";
import { parseDriverLapTimes, parseRecordLapTimes } from "@/utils/frontend/fastestLapsPage/parsers";
import { getDriverLapTimes, getGrandPrix, getGrandPrixDrivers, getRecordLapTimes } from "@/utils/frontend/fastestLapsPage/requests";
import GrandPrixDropDownFilterSingle from "@/components/GrandPrixDropDownFilterSingle";
import DriverDropDownSelector from "@/components/DriverDropDownSelector";
import CustomLineChart from "@/components/CustomLineChart";
import CustomRecordTooltip from "@/components/CustomRecordTooltip";
import { Checkbox, FormControlLabel } from "@mui/material";

export type ConstructorResult = {
  year: number;
  [key: string]: number;
}

interface ReducerState {
  years: [number, number],
  datapoints: ConstructorResult[],
  selectableDrivers: { key: string, value: string }[],
  selectedDrivers: string[],
  allDrivers: { driver: string, constructor: string }[],
  driverConstructors: {
    [driver: string]: { [year: string]: string }
  },
  selectableGrandPrix: { key: string, value: string }[],
  selectedGrandPrix: string,
  loading: boolean,
  record: boolean,
  includePredictions: boolean,
}

const fetchDrivers = async (years: [number, number], grandPrixId: string) => {
  const drivers = await getGrandPrixDrivers(years[0], years[1], grandPrixId);

  return drivers
    .map((driver: any) => ({ key: driver.driver_id, value: labelizeKey(driver.driver_id) }))
    .sort((a: any, b: any) => a.value.localeCompare(b.value));
}

const fetchGrandPrix = async (years: [number, number]) => {
  const grandPrix = (await getGrandPrix(years[0], years[1]))

  return grandPrix
    .map((grand_prix: any) => ({ key: grand_prix.grand_prix_id, value: labelizeKey(grand_prix.grand_prix_id) }))
    .sort((a: any, b: any) => a.value.localeCompare(b.value));
}

const fetchLapTimes = async (
  years: [number, number],
  drivers: string[],
  grand_prix_id: string,
  includePredictions: boolean,
) => {
  const datapoints = drivers[0] === "record"
    ? parseRecordLapTimes(await getRecordLapTimes(years[0], years[1], grand_prix_id, includePredictions))
    : parseDriverLapTimes(await getDriverLapTimes(years[0], years[1], drivers, grand_prix_id));

  const { data, encountered, driverConstructorMap } = datapoints.reduce((
    acc: any,
    { key, driver_id, constructor_id, value }: any
  ) => {
    const dataRow = acc.data[key] || {}
    const driverConstructorObject = acc.driverConstructorMap[driver_id] || {};
    const latestDriver = acc.encountered[driver_id];
    const newDriver = (latestDriver?.key || -Infinity) < key
      ? { key, driver_id, constructor_id, value }
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
    data: {},
    driverConstructorMap: {}
  });

  return {
    data: Object.keys(data).map((key: string) => ({ ...data[key], key })),
    uniqueDrivers: Object.keys(encountered).map((driver: string) => ({ driver, constructor: encountered[driver].constructor_id })),
    driverConstructorMap: driverConstructorMap
  }
};

const stateWithDatapoints = async (state: ReducerState) => {
  const { data, uniqueDrivers, driverConstructorMap } = await fetchLapTimes(state.years, state.selectedDrivers, state.selectedGrandPrix, state.includePredictions);
  return { ...state, datapoints: data, allDrivers: uniqueDrivers, driverConstructors: driverConstructorMap };
}

const stateWithSelectableDrivers = async (state: ReducerState) => {
  if (state.selectedGrandPrix) {
    const selectableDrivers = await fetchDrivers(state.years, state.selectedGrandPrix);
    return {
      ...state,
      selectableDrivers
    };
  } else {
    return state;
  }

}

const stateWithSelectableGrandPrix = async (state: ReducerState) => {
  const selectableGrandPrix = await fetchGrandPrix(state.years);
  return {
    ...state,
    selectableGrandPrix
  };
}

const initialState = {
  years: [2020, 2024],
  datapoints: [],
  selectableDrivers: [],
  selectedDrivers: [],
  allDrivers: [],
  driverConstructors: {},
  selectableGrandPrix: [],
  selectedGrandPrix: "",
  loading: false,
  record: false,
  includePredictions: false,
} as ReducerState;

const reducer = (state: ReducerState, action: { type: string, payload: any }) => {
  const { type } = action;
  switch (type) {
    case "setTimeFrame":
      return { ...initialState, ...action.payload }
    case "setGrandPrix":
      return { ...initialState, years: state.years, selectableGrandPrix: state.selectableGrandPrix, selectedGrandPrix: action.payload.selectedGrandPrix, selectableDrivers: action.payload.selectableDrivers }
    case "setAll":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default function FastestLapsPage() {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    const setInitialState = async () => {
      const withSelectableGrandPrix = await stateWithSelectableGrandPrix(initialState);
      dispatch({
        type: "setAll", payload: {
          ...initialState,
          years: withSelectableGrandPrix.years,
          selectableGrandPrix: withSelectableGrandPrix.selectableGrandPrix,
          selectedDrivers: withSelectableGrandPrix.selectedDrivers[0] === "record" ? withSelectableGrandPrix.selectedDrivers : []
        }
      });
    }
    setInitialState();
  }, []);

  const onSetTimeFrame = useCallback(async (currentState: ReducerState, years: [number, number]) => {
    const withSelectableGrandPrix = await stateWithSelectableGrandPrix({ ...currentState, years })
    dispatch({
      type: "setAll", payload: {
        ...initialState,
        years: withSelectableGrandPrix.years,
        selectableGrandPrix: withSelectableGrandPrix.selectableGrandPrix,
        selectedDrivers: currentState.selectedDrivers[0] === "record" ? currentState.selectedDrivers : []
      }
    });
  }, []);

  const onSetGrandPrix = useCallback(async (currentState: ReducerState, selectedGrandPrix: string) => {
    const withSelectableDrivers = await stateWithSelectableDrivers({ ...currentState, selectedGrandPrix })
    if (currentState.selectedDrivers[0] === "record") {
      const withDatapoints = await stateWithDatapoints({ ...currentState, selectedGrandPrix });
      dispatch({
        type: "setAll", payload: {
          ...withDatapoints,
          years: withSelectableDrivers.years,
          selectedGrandPrix: withSelectableDrivers.selectedGrandPrix,
          selectableGrandPrix: withSelectableDrivers.selectableGrandPrix,
          selectableDrivers: withSelectableDrivers.selectableDrivers
        }
      });
    } else {
      dispatch({
        type: "setAll", payload: {
          ...initialState,
          years: withSelectableDrivers.years,
          selectedGrandPrix: withSelectableDrivers.selectedGrandPrix,
          selectableGrandPrix: withSelectableDrivers.selectableGrandPrix,
          selectableDrivers: withSelectableDrivers.selectableDrivers
        }
      });
    }
  }, []);

  const onSetDrivers = useCallback(async (currentState: ReducerState, drivers: string[]) => {
    const withDatapoints = await stateWithDatapoints({ ...currentState, selectedDrivers: drivers });
    dispatch({ type: "setAll", payload: withDatapoints });
  }, []);

  const BarTooltip = (props: any) => {
    const data = state.datapoints.find((entry: any) => entry.key === props.axisValue);
    return <CustomBarTooltip drivers={data} allDrivers={state.allDrivers} displayPoints={false} />
  }

  const LineTooltip = (props: any) => {
    const data = state.datapoints.find((entry: any) => entry.key === props.axisValue);
    return <CustomRecordTooltip drivers={data} allDrivers={state.allDrivers} driverConstructors={state.driverConstructors} />
  }

  const TooltipHighlight = (props: any) => {
    return <CustomBarTooltipHighlight
      highlightedItem={props.highlightedItem}
      axisValue={props.axisValue}
      datapoints={state.datapoints}
      allDrivers={state.allDrivers}
      driverConstructors={state.driverConstructors}
      displayPoints={false}
    />
  }

  const handleChange = async (currentState: ReducerState) => {
    const withAll = await stateWithDatapoints( { ...currentState, includePredictions: !currentState.includePredictions });
    dispatch({ type: "setAll", payload: withAll });
  }

  return (
    <section className="bg-black">
      <div className="container-drivers container-page" style={{ color: "white", backgroundColor: "black" }}>
        <Header />

        <div className="ml-12 mt-10 flex gap-10">
          <DropDownSelector
            interval={state.years}
            setInterval={(interval: number[]) => {
              onSetTimeFrame(state, [interval[0], interval[1]]);
            }}
          />

          <GrandPrixDropDownFilterSingle
            selectableGrandPrix={state.selectableGrandPrix}
            selectedGrandPrix={state.selectedGrandPrix}
            setGrandPrix={(grand_prix: string) => {
              onSetGrandPrix(state, grand_prix);
            }}
          />

          <DriverDropDownSelector
            selectableDrivers={state.selectableDrivers}
            selectedDrivers={state.selectedDrivers}
            setSelectedDrivers={(drivers: string[]) => {
              onSetDrivers(state, drivers);
            }}
          />

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  className="text-white"
                  onChange={() => { handleChange(state); }}
                  disabled={state.selectedDrivers[0] !== "record" || state.years[1] !== 2024}
                />
              }
              label={
                state.selectedDrivers[0] === "record"
                  ? "SHOW PREDICTIONS"
                  : ""
              }
            />
          </div>

        </div>

        {
          !state.loading && (
            <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <div style={{ minHeight: "300px" }}>
                {state.selectedDrivers[0] === "record"
                  ? <CustomLineChart
                    datapoints={state.datapoints}
                    series={state.allDrivers.map((driver: any) => {


                      return {
                        dataKey: driver.driver,
                        label: labelizeKey(String(driver.driver)),
                        curve: 'linear',
                        color: '#008080',
                        showMark: false,
                        highlightScope: { highlight: 'item', fade: 'global' },
                        connectNulls: true,
                      };
                    })}
                    CustomTooltip={LineTooltip}
                    CustomTooltipHighlight={TooltipHighlight}
                    margin={{
                      bottom: 30,
                      left: 100,
                      right: 100,
                    }}
                    bottomAxis={{
                      tickLabelStyle: {
                        angle: 0,
                        textAnchor: 'middle',
                      }
                    }}
                    displayPoints={false}
                    selectedGrandPrix={state.selectedGrandPrix}
                    emptyXAxis={Array.from({ length: state.years[1] - state.years[0] + 1 }, (v, i) => i + state.years[0])}
                  />
                  : <CustomBarChart
                    datapoints={state.datapoints}
                    allDrivers={state.allDrivers}
                    CustomTooltip={BarTooltip}
                    CustomTooltipHighlight={TooltipHighlight}
                    years={state.years}
                    displayPoints={false}
                    selectedGrandPrix={state.selectedGrandPrix}
                  />
                }

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