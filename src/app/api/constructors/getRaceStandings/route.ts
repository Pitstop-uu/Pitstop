import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import response from '@/utils/api/jsonResponse';

export async function GET(req: NextRequest, res: NextResponse) {
	const params = req.nextUrl.searchParams;
	const year = params.get('year');
	const stringIsNr = (str: string) => str.match(/^\d+$/)
	if(!(year && stringIsNr(year))) {
	  return response(false, 400, []);
	}

	const prisma = new PrismaClient();

    // Fetching all relevant data points
	const queryResult = await prisma.$queryRaw<{
		constructor_id: string;
		points: number;
		year: number;
		official_name: string;
		date: string;
	}[]>`
	SELECT 
		race_constructor_standing.constructor_id,
		race_constructor_standing.points,
		race.year,
		race.official_name,
		race.date,
        race.circuit_id,
        race.grand_prix_id
	FROM 
		race_constructor_standing
		JOIN race ON race.id = race_constructor_standing.race_id AND race.year = ${year}`;

	return response(false, 400, queryResult);
}