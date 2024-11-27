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
		race_constructor_standing.constructor_id,
		race_constructor_standing.points,
		race.year,
		race.date,
		race.official_name,
        race.circuit_id,
        race.grand_prix_id
	FROM 
		race_constructor_standing
		JOIN race ON race.id = race_constructor_standing.race_id 
		AND race.year = ${requestBody.year}
		${
			'constructors' in requestBody 
				? Prisma.sql`AND constructor_id IN (SELECT value from json_each(${JSON.stringify(requestBody.constructors)}))`
				: Prisma.empty
		}
	ORDER BY
		race.date ASC`;

	return response(true, 200, queryResult);
}