import { PrismaClient } from "@prisma/client";

export type ConstructorChronologyRecord = {
  constructor_id: string,
  other_constructor_id: string,
  year_from: number,
  year_to: number
}

const constructorChronologies = async (
  prisma: PrismaClient,
  fromYear: number,
  toYear: number
) => {
  return await prisma.$queryRaw<ConstructorChronologyRecord[]>`
  SELECT
    constructor_id,
    other_constructor_id,
    year_from,
    year_to
  FROM 
    constructor_chronology
  WHERE
    year_from BETWEEN ${fromYear} AND ${toYear}
    OR year_to BETWEEN ${fromYear} AND ${toYear}`;
}

export default constructorChronologies;