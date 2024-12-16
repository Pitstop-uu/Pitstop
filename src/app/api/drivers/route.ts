import { PrismaClient } from '@prisma/client'
import { NextRequest } from "next/server";
import response from '@/utils/api/jsonResponse';
import stringIsNr from '@/utils/api/stringIsNr';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const from = params.get('from');
    const to = params.get('to');
    if (!(from && stringIsNr(from)) || !(to && stringIsNr(to))) {
        return response(false, 400, []);
    }

    const prisma = new PrismaClient();
    const queryResult = await prisma.$queryRaw<{
        id: string, full_name: string
    }[]>`
    SELECT
      driver.id
    FROM driver
    WHERE EXISTS (SELECT 1
      FROM season_driver_standing
      WHERE season_driver_standing.driver_id = driver.id
      AND season_driver_standing.year BETWEEN ${from} AND ${to})`;

    return response(true, 200, queryResult);
}