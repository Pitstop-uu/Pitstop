import { PrismaClient } from '@prisma/client'
import { NextRequest } from "next/server";
import response from '@/utils/api/jsonResponse';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const from = params.get('from');
    const to = params.get('to');
    const stringIsNr = (str: string) => str.match(/^\d+$/)
    if (!(from && stringIsNr(from)) || !(to && stringIsNr(to))) {
        return response(false, 400, []);
    }

    const prisma = new PrismaClient();
    const queryResult = await prisma.$queryRaw<{
        grand_prix_id: string
    }[]>`
    SELECT DISTINCT grand_prix_id
    FROM race
    WHERE year BETWEEN ${from} AND ${to}`;

    return response(true, 200, queryResult);
}