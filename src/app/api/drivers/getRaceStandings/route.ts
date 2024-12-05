import { PrismaClient, Prisma } from '@prisma/client'
import { NextRequest } from 'next/server';
import response from '@/utils/api/jsonResponse';

export async function POST(req: NextRequest) {
	const requestBody = await req.json();
	if (!('year' in requestBody && typeof requestBody.year === 'number')) {
		return response(false, 400, []);
	}

	const prisma = new PrismaClient();

	interface RaceStandingRecord {
		driver_id: string;
		constructor_id: string;
		points: number;
		year: number;
		date: string;
		official_name: string;
		grand_prix_id: string;
		circuit_id: string;
	}
	const queryResult = await prisma.$queryRaw<RaceStandingRecord[]>`
	SELECT 
		race_driver_standing.driver_id,
		race_data.constructor_id,
		race_driver_standing.points,
		race.year,
		race.date,
		race.official_name,
        race.circuit_id,
        race.grand_prix_id
	FROM 
		race_driver_standing
		JOIN race_data ON race_data.race_id = race_driver_standing.race_id AND race_data.driver_id = race_driver_standing.driver_id AND race_data.type = "RACE_RESULT"
		JOIN race ON race.id = race_driver_standing.race_id 
		AND race.year = ${requestBody.year}
		${
			'drivers' in requestBody 
				? Prisma.sql`AND race_driver_standing.driver_id IN (SELECT value from json_each(${JSON.stringify(requestBody.drivers)}))`
				: Prisma.empty
		}
	ORDER BY
		race.date ASC`;

	console.log(queryResult);

	return response(true, 200, queryResult);
}
