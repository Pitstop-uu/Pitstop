
export const parseConstructorRaceStandings = (raceStandings: any) => {
    return raceStandings.map((record: any) => ({
        key: record.circuit_id,
        constructor_id: record.constructor_id,
        value: record.points
    }));
}

export const parseConstructorSeasonStandings = (seasonStandings: any) => {
    return seasonStandings.map((record: any) => ({
        key: record.year,
        constructor_id: record.constructor_id,
        value: record.points
    }))
}