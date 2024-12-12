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

const stateWithAll = async (state: ReducerState) => {
  return await stateWithSelectableConstructors(await stateWithDatapoints(state));
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
            <span> <span className="highlight">What is Pitstop?</span> <span className="text-white">Pitstop is an innovative Formula 1 tool designed to bring the sport&apos;s rich history to life. Through dynamic data visualizations covering every season since F1 began in 1950, Pitstop lets you explore the evolution of Formula 1 in a completely new way.</span></span>
          </div>
          <span className="content-description-text"> Discover historical data such as fastest lap times for each driver on specific circuits across all seasons. Dive deep into performance trends, track records, and the evolution of speed, precision, and competition in Formula 1—all in one intuitive platform.</span>
        </div>
      </section>

      <section>
        <div className="preview-section">
          <span className="preview-title">Search. Discover. Compare.</span>
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
              displayPoints={true}
              emptyXAxis={[]}
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

