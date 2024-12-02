import { PrismaClient, Prisma } from '@prisma/client'
import { NextRequest } from 'next/server';
import response from '@/utils/api/jsonResponse';

export async function POST(req: NextRequest) {
	const requestBody = await req.json();
	if (
		!('from' in requestBody && typeof requestBody.from === 'number') ||
		!('to' in requestBody && typeof requestBody.to === 'number') 
	) {
		return response(false, 400, []);
	}

	const prisma = new PrismaClient();

	// Fetching all relevant data points
	const queryResult = await prisma.$queryRaw<{
		constructor_id: string;
		points: number;
		year: number;
	}[]>`
	WITH s_d_subset AS (SELECT 
		driver_id,
		points,
		year
	FROM 
		season_driver_standing
	WHERE
		year BETWEEN ${requestBody.from} AND ${requestBody.to}
		${
			'drivers' in requestBody 
				? Prisma.sql`AND driver_id IN (SELECT value from json_each(${JSON.stringify(requestBody.drivers)}))`
				: Prisma.empty
		}
    )
    SELECT 
        s_d_subset.year,
        s_d_subset.driver_id,
        s_d_subset.points,
        season_entrant_driver.constructor_id
    FROM 
        s_d_subset
        JOIN season_entrant_driver ON season_entrant_driver.driver_id = s_d_subset.driver_id
        AND season_entrant_driver.year = s_d_subset.year
        AND NOT season_entrant_driver.test_driver
	ORDER BY
		s_d_subset.year ASC`;

	return response(true, 200, queryResult);
}