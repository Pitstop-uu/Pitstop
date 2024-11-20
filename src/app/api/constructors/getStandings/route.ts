import { PrismaClient, Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import response from '@/utils/api/jsonResponse';

interface ConstructorStandingsRequest {
	from: number;
	to: number;
	constructors?: string[];
}
export async function POST(req: NextRequest, res: NextResponse) {
	const requestBody = await req.json() as ConstructorStandingsRequest;
	if (
		!('from' in requestBody && typeof requestBody.from === 'number') ||
		!('to' in requestBody && typeof requestBody.to === 'number') 
	) {
		return response(false, 400, []);
	}

	const queryResult = await new PrismaClient().$queryRaw<{
		constructor_id: string;
		total_points: number;
		year: number;
		full_name: string;
	}[]>`
	WITH s_c_subset AS (
		SELECT 
			* 
		FROM 
			season_constructor 
		WHERE
			year BETWEEN ${requestBody.from} AND ${requestBody.to}
			${
				'constructors' in requestBody 
					? Prisma.sql`AND constructor_id IN (SELECT value from json_each(${JSON.stringify(requestBody.constructors || [])}))`
					: Prisma.empty
			}
	)
	SELECT 
		s_c_subset.constructor_id,
		s_c_subset.total_points,
		s_c_subset.year,
		constructor.full_name
	FROM 
		s_c_subset
		LEFT JOIN constructor ON constructor.id = s_c_subset.constructor_id`

	return response(true, 200, queryResult);
}