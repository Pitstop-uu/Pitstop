import { PrismaClient, Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import response from '@/utils/api/jsonResponse';

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

	interface RaceStandingRecord {
		driver_id: string;
		constructor_id: string;
		year: number;
		date: string;
		grand_prix_id: string;
        fastest_lap_time_millis: number;
        race_fastest_lap: boolean;
	}
	const queryResult = await prisma.$queryRaw<RaceStandingRecord[]>`
	SELECT 
		race_data.driver_id,
		race_data.constructor_id,
		race.year,
		race.date,
        race.grand_prix_id,
        race_data.fastest_lap_time_millis,
        race_data.race_fastest_lap
	FROM 
		race_data
		JOIN race ON race.id = race_data.race_id
		AND race.year BETWEEN ${requestBody.from} AND ${requestBody.to}
        AND race.grand_prix_id = ${requestBody.grand_prix_id}
        AND race_data.type = "FASTEST_LAP"
		${
			'drivers' in requestBody 
				? Prisma.sql`AND race_data.driver_id IN (SELECT value from json_each(${JSON.stringify(requestBody.drivers)}))`
				: Prisma.empty
		}
	ORDER BY
		race.date ASC`;

	console.log(queryResult);

	return response(true, 200, queryResult);
}
