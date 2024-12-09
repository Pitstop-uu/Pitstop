export const getDriverLapTimes = async (
    yearFrom: number,
    yearTo: number,
    drivers: string[],
    circuit: string
) => {
    const requestBody: { [key: string]: any } = { from: yearFrom, to: yearTo, drivers , grand_prix_id: circuit }
    //if (drivers.length) requestBody.drivers = drivers;
    const response = await window.fetch(
      `/api/drivers/getFastestLaps`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody)
      }
    )
    const responseJson = await response.json();
    return responseJson.data;
}

export const getGrandPrix = async (yearFrom: number, yearTo: number) => {
  const response = await window.fetch(`/api/grand_prix?from=${yearFrom}&to=${yearTo}`);
  const responseJson = await response.json();
  return responseJson.data;
}

export const getGrandPrixDrivers = async (
  yearFrom: number,
  yearTo: number,
  grandPrixId: string
) => {
  const response = await window.fetch(
    `/api/grand_prix/${grandPrixId}/drivers/?from=${yearFrom}&to=${yearTo}`
  );
  const responseJson = await response.json();
  return responseJson.data;
}

export const getRecordLapTimes = async (
  yearFrom: number,
  yearTo: number,
  grandPrixId: string
) => {
  const requestBody: { [key: string]: any } = {
    from: yearFrom,
    to: yearTo,
    grand_prix_id: grandPrixId
  }
  const response = await window.fetch(
    `/api/grand_prix/${grandPrixId}/getFastestLaps`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }
  )
  const responseJson = await response.json();
  return responseJson.data;
}