"use client"

import "@/styles/constructors.css";
import Header from "@/components/Header";
import { useEffect, useCallback, useReducer } from "react";

import ConstructorDropDownFilterMultiple from "@/components/ConstructorDropDownFilterMultiple";
import CustomLegend from "@/components/CustomLegend";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { getConstructorStandings, getConstructors, getConstructorRaceStandings, getLatestId } from "@/utils/frontend/constructorPage/requests";
import { parseConstructorRaceStandings, parseConstructorSeasonStandings } from "@/utils/frontend/constructorPage/parsers";
import DropDownSelector from "@/components/DropDownSelector";
import CustomLineChart from "@/components/CustomLineChart";
import { constructorColors } from "@/components/ui/ConstructorColors";
import CustomTooltip from "@/components/CustomTooltip";
import CustomTooltipHighlight from "@/components/CustomTooltipHighlight";
import { Checkbox, FormControlLabel } from "@mui/material";

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
  includePredictions: boolean,
}


const fetchConstructors = async (years: [number, number]) => {
  return (await getConstructors(years[0], years[1]))
    .map((constructor: any) => ({ key: constructor.id, value: labelizeKey(constructor.id) }));
}

const fetchStandings = async (
  years: [number, number],
  constructors: string[],
  includePredictions: boolean,
) => {
  const datapoints =
    years[0] === years[1]
      ? parseConstructorRaceStandings(await getConstructorRaceStandings(years[0], constructors))
      : parseConstructorSeasonStandings(await getConstructorStandings(years[0], years[1], constructors, includePredictions));

  const { data, uniqueConstructors } = datapoints.reduce(
    (acc: any, { key, constructor_id, value }: any) => {
      const dataRow = acc.data[key] || {};
      return {
        encountered: acc.encountered[constructor_id]
          ? acc.encountered
          : { ...acc.encountered, [constructor_id]: true },
        uniqueConstructors: acc.encountered[constructor_id]
          ? acc.uniqueConstructors
          : acc.uniqueConstructors.concat(constructor_id),
        data: { ...acc.data, [key]: { ...dataRow, [constructor_id]: Number(value) } },
      };
    },
    {
      encountered: {},
      uniqueConstructors: [],
      data: {},
    }
  );

  /*   //add predictions
    if (showPredictions && predictedPoints && years[0] !== years[1]) {
      const predictionKey = "2025"; // Key for the predicted year
    
      // If no specific constructors are selected, use all constructors with predictions
      const filteredPredictions = (constructors.length > 0 ? constructors : Object.keys(predictedPoints))
        .reduce((acc: any, constructor_id) => {
          if (predictedPoints[constructor_id] !== undefined) {
            acc[constructor_id] = predictedPoints[constructor_id];
          }
          return acc;
        }, {});
    
      // Add predictions to the data
      if (Object.keys(filteredPredictions).length > 0) {
        data[predictionKey] = { ...filteredPredictions, key: predictionKey };
        uniqueConstructors.push(...Object.keys(filteredPredictions));
      }
    } */

  return {
    data: Object.keys(data).map((key: string) => ({ ...data[key], key })),
    uniqueConstructors: [...new Set(uniqueConstructors)],
  };
};

const fetchLatestId = async (constructors: string[]) => {
  return (await getLatestId(constructors));
}

const stateWithDatapoints = async (state: ReducerState) => {
  const { data, uniqueConstructors } = await fetchStandings(state.years, state.selectedConstructors, state.includePredictions);
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
  includePredictions: false,
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
  }, []);

  const Tooltip = (props: any) => {
    const data = state.datapoints.find((entry: any) => entry.key === props.axisValue);
    return <CustomTooltip constructors={data} latestConstructorIdMap={state.latestConstructorIdMap} />
  }

  const TooltipHighlight = (props: any) => {
    return <CustomTooltipHighlight highlightedItem={props.highlightedItem} axisValue={props.axisValue} datapoints={state.datapoints} allConstructors={state.allConstructors} latestConstructorIdMap={state.latestConstructorIdMap} />
  }

  const handleChange = async (currentState: ReducerState) => {
    const withAll = await stateWithAll( { ...currentState, includePredictions: !currentState.includePredictions });
    dispatch({ type: "set", payload: withAll });
  }

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
            minYear={1958}
          />

          <ConstructorDropDownFilterMultiple
            selectableConstructors={state.selectableConstructors}
            latestConstructorIdMap={state.latestConstructorIdMap}
            selectedConstructors={state.selectedConstructors}
            setSelectedConstructors={(constructors: string[]) => {
              onSetSelected(state, constructors);
            }}
          />

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  className="text-white"
                  onChange={() => { handleChange(state); }}
                  disabled={state.years[0] === state.years[1] || state.years[1] !== 2024}
                />
              }
              label={
                state.years[0] !== state.years[1] && state.years[1] === 2024
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
                <CustomLineChart
                  datapoints={state.datapoints}
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
                  displayPoints={true}
                  emptyXAxis={[]}
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