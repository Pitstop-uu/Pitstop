
export const parseDriverSeasonStandings = (seasonStandings: any) => {
    return seasonStandings.map((record: any) => ({
        key: record.year,
        driver_id: record.driver_id,
        constructor_id: record.constructor_id,
        value: record.points
    }))
}