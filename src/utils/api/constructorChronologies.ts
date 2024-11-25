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
    NOT (year_from < ${fromYear} AND year_to < ${fromYear}) AND
    NOT (year_from > ${toYear} AND year_to > ${toYear})`;
}

export default constructorChronologies;