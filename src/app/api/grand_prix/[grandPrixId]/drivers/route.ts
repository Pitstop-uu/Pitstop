import { PrismaClient } from '@prisma/client'
import { NextRequest } from "next/server";
import response from '@/utils/api/jsonResponse';
import stringIsNr from '@/utils/api/stringIsNr';

export async function GET(req: NextRequest, { params }: { params: Promise<{ grandPrixId: string }> }) {
    const searchParams = req.nextUrl.searchParams;
    const searchParamFrom = searchParams.get('from');
    const searchParamTo = searchParams.get('to');
    const from = searchParamFrom && stringIsNr(searchParamFrom)
      ? searchParamFrom
      : 1950;
    const to = searchParamTo && stringIsNr(searchParamTo)
      ? searchParamTo
      : new Date().getFullYear();

      const prisma = new PrismaClient();
      const queryResult = await prisma.$queryRaw<{
          driver_id: string,
      }[]>`
      SELECT DISTINCT
        race_data.driver_id
      FROM 
        race_data
        JOIN race ON race.id = race_data.race_id
        AND race.grand_prix_id = ${(await params).grandPrixId}
        AND race.year BETWEEN ${from} AND ${to}
        AND race_data.type = "FASTEST_LAP"`;

    return response(true, 200, queryResult);
}