export const getConstructorStandings = async (
    yearFrom: number,
    yearTo: number,
    constructors: string[],
    includePredictions: boolean
) => {
    const requestBody: { [key: string]: any } = { from: yearFrom, to: yearTo, includePredictions }
    if (constructors.length) requestBody.constructors = constructors;
    const response = await window.fetch(
      `/api/constructors/getStandings`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody)
      }
    )
    const responseJson = await response.json();
    return responseJson.data;
}

export const getConstructorRaceStandings = async (
  year: number,
  constructors: string[] = []
) => {
  const requestBody: { [key: string]: any } = { year };
  if (constructors.length) requestBody.constructors = constructors;
  const response = await window.fetch(
    `/api/constructors/getRaceStandings`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }
  )
  const responseJson = await response.json();
  return responseJson.data;
}

export const getConstructors = async (yearFrom: number, yearTo: number) => {
    const response = await window.fetch(`/api/constructors?from=${yearFrom}&to=${yearTo}`);
    const responseJson = await response.json();
    return responseJson.data;
}

export const getLatestId = async (constructors: string[]) => {
  const response = await window.fetch(`/api/constructors/getLatestId`, {
    method: 'POST',
    body: JSON.stringify({ constructors })
  });
  const responseJson = await response.json();
  return responseJson.data;
}