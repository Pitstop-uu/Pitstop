export const parseDriverLapTimes = (driverLapTimes: any) => {
    return driverLapTimes.map((record: any) => ({
        key: record.year,
        driver_id: record.driver_id,
        constructor_id: record.constructor_id,
        value: record.fastest_lap_time_millis
    }))
}

