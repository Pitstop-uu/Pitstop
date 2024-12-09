import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server';
import response from '@/utils/api/jsonResponse';
import getConstructorChronologies from '@/utils/api/constructorChronologies';
import getLatestConstructorMap from '@/utils/api/latestConstructorMap';

export async function POST(req: NextRequest){
    const requestBody = await req.json();
	if (
        !('from' in requestBody && typeof requestBody.from === 'number') ||
        !('to' in requestBody && typeof requestBody.to === 'number') ||
        !('grand_prix_id' in requestBody && typeof requestBody.grand_prix_id === 'string')
    ) {
		return response(false, 400, []);
	}

	const prisma = new PrismaClient();

	interface FastestLapsRecord {
		driver_id: string;
		constructor_id: string;
		year: number;
		date: string;
		grand_prix_id: string;
        fastest_lap_time_millis: number;
	}
	const queryResult = await prisma.$queryRaw<FastestLapsRecord[]>`
	SELECT 
		race_data.driver_id,
		race_data.constructor_id,
		race.year,
		race.date,
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

	const constructorChronologies = await getConstructorChronologies(prisma, requestBody.from, requestBody.to);
	const latestConstructorMap = getLatestConstructorMap(constructorChronologies);
	const result = fastestLaps.map((record: any) => {
		const constructorMapping = latestConstructorMap[record.constructor_id];
		return constructorMapping
			? { ...record, constructor_id: constructorMapping.other_constructor_id }
			: record;
	}, []);
	
	console.log(result);

	return response(true, 200, result);
}
