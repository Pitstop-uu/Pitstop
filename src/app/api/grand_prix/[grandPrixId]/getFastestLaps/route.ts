import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server';
import response from '@/utils/api/jsonResponse';
import getConstructorChronologies from '@/utils/api/constructorChronologies';
import getLatestConstructorMap from '@/utils/api/latestConstructorMap';

export async function POST(req: NextRequest) {
	const requestBody = await req.json();
	console.log("req body",  requestBody);
	if (
		!('from' in requestBody && typeof requestBody.from === 'number') ||
		!('to' in requestBody && typeof requestBody.to === 'number') ||
		!('grand_prix_id' in requestBody && typeof requestBody.grand_prix_id === 'string')
	) {
		return response(false, 400, []);
	}

	const prisma = new PrismaClient();

	const selectedGrandPrix = (requestBody.grand_prix_id || []);

	interface FastestLapsRecord {
		driver_id: string;
		constructor_id: string;
		year: number;
		grand_prix_id: string;
		fastest_lap_time_millis: number;
	}
	const queryResult = await prisma.$queryRaw<FastestLapsRecord[]>`
	SELECT 
		race_data.driver_id,
		race_data.constructor_id,
		race.year,
        race.grand_prix_id,
        race_data.fastest_lap_time_millis
	FROM 
		race_data
		JOIN race ON race.id = race_data.race_id
		AND race.year BETWEEN ${requestBody.from} AND ${requestBody.to}
        AND race.grand_prix_id = ${requestBody.grand_prix_id}
        AND race_data.type = "FASTEST_LAP"
	ORDER BY
		race.date ASC`;

	const fastestLaps = Object.values(queryResult.reduce((acc: any, record: FastestLapsRecord) => {
		const currentRecord = acc[record.year]
		if (record.fastest_lap_time_millis < (currentRecord?.fastest_lap_time_millis || Infinity)) {
			return { ...acc, [record.year]: record }
		} else {
			return acc
		}
	}, {}));

	const predictedLapTimes = [
		{ year: 2025, grand_prix_id: 'las-vegas', fastest_lap_time_millis: 88318, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'spain', fastest_lap_time_millis: 83022, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'austria', fastest_lap_time_millis: 78646, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'bahrain', fastest_lap_time_millis: 88275, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'saudi-arabia', fastest_lap_time_millis: 87693, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'australia', fastest_lap_time_millis: 84165, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'japan', fastest_lap_time_millis: 88540, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'china', fastest_lap_time_millis: 86108, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'miami', fastest_lap_time_millis: 86070, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'emilia-romagna', fastest_lap_time_millis: 83920, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'monaco', fastest_lap_time_millis: 83655, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'canada', fastest_lap_time_millis: 83466, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'great-britain', fastest_lap_time_millis: 87379, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'hungary', fastest_lap_time_millis: 82782, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'belgium', fastest_lap_time_millis: 91486, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'netherlands', fastest_lap_time_millis: 83509, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'italy', fastest_lap_time_millis: 85592, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'azerbaijan', fastest_lap_time_millis: 91200, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'singapore', fastest_lap_time_millis: 90664, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'united-states', fastest_lap_time_millis: 89769, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'mexico', fastest_lap_time_millis: 83543, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'sao-paolo', fastest_lap_time_millis: 85589, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'qatar', fastest_lap_time_millis: 84807, driver_id: 'record', constructor_id: 'predicted' },
		{ year: 2025, grand_prix_id: 'abu-dhabi', fastest_lap_time_millis: 88739, driver_id: 'record', constructor_id: 'predicted' },
	]

	const filteredPredictedPoints = predictedLapTimes.filter(({ grand_prix_id }) => selectedGrandPrix === grand_prix_id)

	const constructorChronologies = await getConstructorChronologies(prisma, requestBody.from, requestBody.to);
	const latestConstructorMap = getLatestConstructorMap(constructorChronologies);
	const fastestLapsResult = fastestLaps.map((record: any) => {
		const constructorMapping = latestConstructorMap[record.constructor_id];
		return constructorMapping
			? { ...record, constructor_id: constructorMapping.other_constructor_id }
			: record;
	}, []);

	const result =  requestBody.includePredictions === true && requestBody.to === 2024
		? fastestLapsResult.concat(filteredPredictedPoints)
		: fastestLapsResult;

	console.log(result);

	return response(true, 200, result);
}
