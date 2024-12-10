import { PrismaClient, Prisma } from '@prisma/client'
import { NextRequest } from 'next/server';
import response from '@/utils/api/jsonResponse';
import getConstructorChronologies from '@/utils/api/constructorChronologies';
import getConstructorAliasMap from '@/utils/api/constructorAliasMap';
import getLatestConstructorMap from '@/utils/api/latestConstructorMap';

export async function POST(req: NextRequest) {
	const requestBody = await req.json();
	console.log(requestBody);
	if (
		!('from' in requestBody && typeof requestBody.from === 'number') ||
		!('to' in requestBody && typeof requestBody.to === 'number')
	) {
		return response(false, 400, []);
	}

	const prisma = new PrismaClient();

	// Gets all constructor chronology records in the selected time-span
	const constructorChronologies = await getConstructorChronologies(prisma, requestBody.from, requestBody.to);

	// Maps all selected constructors to their aliases,
	// so that we can fetch all relevant datapoints from the database.
	// For example, "kick-sauber" will be mapped to ["kick-sauber", "alfa-romeo"],
	// if the selected time-span contains the name change from Alfa Romeo to Kick Sauber.
	const constructorAliasMap = getConstructorAliasMap(constructorChronologies);
	const selectedConstructors = (requestBody.constructors || [])
		.reduce((acc: any, constructor: string) => acc.concat(constructorAliasMap[constructor] || [constructor]), [])

	// Fetching all relevant data points
	const queryResult = await prisma.$queryRaw<{
		constructor_id: string;
		points: number;
		year: number;
	}[]>`
	SELECT 
		constructor_id,
		points,
		year
	FROM 
		season_constructor_standing
	WHERE
		year BETWEEN ${requestBody.from} AND ${requestBody.to}
		${'constructors' in requestBody
			? Prisma.sql`AND constructor_id IN (SELECT value from json_each(${JSON.stringify(selectedConstructors)}))`
			: Prisma.empty
		}
	ORDER BY
		year ASC`;

	const predictedPoints =[
		{ year: 2025, constructor_id: "mercedes", points: 465 },
		{ year: 2025, constructor_id: "red-bull", points: 757 },
		{ year: 2025, constructor_id: "alpine", points: 86 },
		{ year: 2025, constructor_id: "haas", points: 29 },
		{ year: 2025, constructor_id: "mclaren", points: 399 },
		{ year: 2025, constructor_id: "rb", points: 47 },
		{ year: 2025, constructor_id: "kick-sauber", points: 14 },
		{ year: 2025, constructor_id: "ferrari", points: 408 },
		{ year: 2025, constructor_id: "williams", points: 21 },
		{ year: 2025, constructor_id: "aston-martin", points: 162 },	
	]
	const filteredPredictedPoints = selectedConstructors.length > 0
		? predictedPoints.filter((point) => selectedConstructors.includes(point.constructor_id))
		: predictedPoints

	// Each data point's related constructor is mapped
	// to that constructor's latest representation in the selected timespan.
	// For example, "alfa-romeo" will be mapped to "kick-sauber", if
	// the name change from Alfa Romeo to Kick Sauber occured in the selected timespan.
	//TODO: Fix so that the 'full_name' property is updated. 
	//      Currently, only 'constructor_id' is updated correctly.
	const latestConstructorMap = getLatestConstructorMap(constructorChronologies);
	const constructorStandings = queryResult.map((record) => {
		const constructorMapping = latestConstructorMap[record.constructor_id];
		return constructorMapping
			? { ...record, constructor_id: constructorMapping.other_constructor_id }
			: record;
	}, []);

	const result =  requestBody.includePredictions === true && requestBody.to === 2024
		? constructorStandings.concat(filteredPredictedPoints)
		: constructorStandings;

	return response(true, 200, result);
}