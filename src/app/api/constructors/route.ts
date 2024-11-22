import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from "next/server";
import response from '@/utils/api/jsonResponse';
import getConstructorChronologies from '@/utils/api/constructorChronologies';
import getLatestConstructorMap from '@/utils/api/latestConstructorMap';

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

  
  // Removes records that represent old constructors, if a newer representation
  // of that constructor exists in the selected timespan
  const constructorChronology = await getConstructorChronologies(prisma, Number(from), Number(to));
  const latestConstructorMap = getLatestConstructorMap(constructorChronology);
  const filteredConstructors = queryResult.filter(({ id }) => {
    return latestConstructorMap[id]
      ? latestConstructorMap[id].other_constructor_id === id
      : true;
  });

  return response(true, 200, filteredConstructors);
}