
export const parseDriverSeasonStandings = (seasonStandings: any) => {
    return seasonStandings.map((record: any) => ({
        key: record.year,
        driver_id: record.driver_id,
        value: record.points
    }))
}