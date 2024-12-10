import labelizeKey from "../../labelizeKey"

export const parseDriverLapTimes = (driverLapTimes: any) => {
    return driverLapTimes.map((record: any) => ({
        key: record.year,
        driver_id: record.driver_id,
        constructor_id: record.constructor_id,
        value: record.fastest_lap_time_millis
    }))
}

export const parseRecordLapTimes = (recordLapTimes: any) => {
    return recordLapTimes.map((record: any) => ({
        key: record.year,
        driver_id: "record",
        constructor_id: `${labelizeKey(String(record.driver_id))}, ${labelizeKey(String(record.constructor_id))}`,
        value: record.fastest_lap_time_millis
    }))
}