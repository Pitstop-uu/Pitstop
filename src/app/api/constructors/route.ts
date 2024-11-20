import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from "next/server";
import response from '@/utils/api/jsonResponse';
import getConstructorMap from '@/utils/api/constructorMap';

export async function GET(req: NextRequest, res: NextResponse) {
    const params = req.nextUrl.searchParams;
    const from = params.get('from');
    const to = params.get('to');
    const stringIsNr = (str: string) => str.match(/^\d+$/)
    if(!(from && stringIsNr(from)) || !(to && stringIsNr(to))) {
        return response(false, 400, []);
    }

    const prisma = new PrismaClient();
    const queryResult = await prisma.$queryRaw<{
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

    const constructorMap = await getConstructorMap(prisma, Number(from), Number(to));
    const filteredConstructors = queryResult.filter(({ id }) => {
        return constructorMap[id]
            ? constructorMap[id].other_constructor_id === id
            : true;
    });

    return response(true, 200, filteredConstructors);
}