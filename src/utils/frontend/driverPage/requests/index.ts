export const getDriverSeasonStandings = async (
    yearFrom: number,
    yearTo: number,
    drivers: string[]
) => {
    const requestBody: { [key: string]: any } = { from: yearFrom, to: yearTo, drivers }
    //if (drivers.length) requestBody.drivers = drivers;
    const response = await window.fetch(
      `/api/drivers/getSeasonStandings`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody)
      }
    )
    const responseJson = await response.json();
    return responseJson.data;
}

export const getDriverRaceStandings = async (
  year: number,
  drivers: string[]
) => {
  const requestBody: { [key: string]: any } = { year };
  if (drivers.length) requestBody.drivers = drivers;
  const response = await window.fetch(
    `/api/drivers/getRaceStandings`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }
  )
  const responseJson = await response.json();
  return responseJson.data;
}

export const getDrivers = async (yearFrom: number, yearTo: number) => {
    const response = await window.fetch(`/api/drivers?from=${yearFrom}&to=${yearTo}`);
    const responseJson = await response.json();
    return responseJson.data;
}
