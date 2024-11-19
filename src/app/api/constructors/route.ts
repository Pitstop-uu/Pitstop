import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from "next/server";
import response from '@/utils/api/jsonResponse';

export async function GET(req: NextRequest, res: NextResponse) {
    const params = req.nextUrl.searchParams;
    const from = params.get('from');
    const to = params.get('to');
    const stringIsNr = (str: string) => str.match(/^\d+$/)
    if(!(from && stringIsNr(from)) || !(to && stringIsNr(to))) {
        return response(false, 400, []);
    }

    const queryResult = await new PrismaClient().$queryRaw<{
        id: string, full_name: string
    }[]>`
    SELECT
        constructor.id,
        constructor.full_name
    FROM constructor
    WHERE EXISTS (SELECT 1
        FROM season_constructor
        WHERE season_constructor.constructor_id = constructor.id
        AND season_constructor.year BETWEEN ${from} AND ${to})`;

    return response(true, 200, queryResult);
}