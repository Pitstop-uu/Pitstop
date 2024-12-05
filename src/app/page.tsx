"use client"

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import "@/styles/homepage.css";
import ScrollContext from "@/components/ScrollContext";
import LinksBottom from "@/components/LinksBottom";
import CustomLineChart from "@/components/CustomLineChart";
import labelizeKey from "@/utils/frontend/labelizeKey";
import { constructorColors } from "@/components/ui/ConstructorColors";
import CustomTooltip from "@/components/CustomTooltip";
import { useEffect, useReducer } from "react";
import CustomTooltipHighlight from "@/components/CustomTooltipHighlight";
import { ConstructorResult } from "./(pages)/constructors/page";
import { getConstructorStandings, getConstructors, getConstructorRaceStandings, getLatestId } from "@/utils/frontend/constructorPage/requests";
import { parseConstructorRaceStandings, parseConstructorSeasonStandings } from "@/utils/frontend/constructorPage/parsers";
import CustomLegend from "@/components/CustomLegend";

interface ReducerState {
  years: [number, number],
  datapoints: ConstructorResult[],
  selectableConstructors: { key: string, value: string }[],
  selectedConstructors: string[],
  loading: boolean,
}

const initialState = {
  years: [2020, 2024],
  datapoints: [],
  selectableConstructors: [],
  latestConstructorIdMap: {},
  selectedConstructors: ["mclaren", "red-bull", "mercedes", "ferrari"],
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

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    const setInitialState = async () => {
      const initState = await stateWithAll(initialState);
      dispatch({ type: "set", payload: initState });
    }
    setInitialState();
  }, []);

  const Tooltip = (props: any) => {
    const data = state.datapoints.find((entry: any) => entry.key === props.axisValue);
    return <CustomTooltip constructors={data} latestConstructorIdMap={state.latestConstructorIdMap} />
  }

  const TooltipHighlight = (props: any) => {
    return <CustomTooltipHighlight highlightedItem={props.highlightedItem} axisValue={props.axisValue} datapoints={state.datapoints} allConstructors={state.allConstructors} latestConstructorIdMap={state.latestConstructorIdMap} />
  }
  
  const stateWithAll = async (state: ReducerState) => {
    return await stateWithSelectableConstructors(await stateWithDatapoints(state));
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
  const fetchLatestId = async (constructors: string[]) => {
    return (await getLatestId(constructors));
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
      : parseConstructorSeasonStandings(await getConstructorStandings(years[0], years[1], constructors, false));
  
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

  return (
    <ScrollContext>
    <section>
    <div className="container-new">
      <Header />
      <Hero />
    </div>
    </section>

    <section>
      <div className="content-section">
        <div className="content">
          <span> <span className="highlight">WHAT IS PITSTOP?</span> <span className="text-white">PITSTOP IS AN INNOVATIVE FORMULA 1 TOOL DESIGNED TO BRING THE SPORT&apos;S RICH HISTORY TO LIFE. THROUGH DYNAMIC DATA VISUALIZATIONS COVERING EVERY SEASON SINCE F1 BEGAN IN 1950, PITSTOP LETS YOU EXPLORE THE EVOLUTION OF FORMULA 1 IN A COMPLETELY NEW WAY.</span></span>
        </div>
        <span className="content-description-text"> DISCOVER HISTORICAL DATA SUCH AS FASTEST LAP TIMES FOR EACH DRIVER ON SPECIFIC CIRCUITS ACROSS ALL SEASONS. DIVE DEEP INTO PERFORMANCE TRENDS, TRACK RECORDS, AND THE EVOLUTION OF SPEED, PRECISION, AND COMPETITION IN FORMULA 1—ALL IN ONE INTUITIVE PLATFORM.</span>
      </div>
    </section>

    <section>
      <div className="preview-section">
        <span className="preview-title">SEARCH. DISCOVER. COMPARE.</span>
        <div>
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
                />
                <CustomLegend
                  constructors={state.datapoints}
                  latestConstructorIdMap={state.latestConstructorIdMap}
                />
              </div>
      </div>
    </section>

    <section>
      <LinksBottom />
    </section>
    </ScrollContext>
  );
}

