import { PrismaClient } from '@prisma/client'

type ConstructorChronologyRecord = {
    constructor_id: string,
    other_constructor_id: string,
    year_from: number,
    year_to: number
}

const constructorMap = async (
    prisma: PrismaClient,
    fromYear: number, 
    toYear: number
) => {
    const constructorChronologyRecords = await prisma.$queryRaw<ConstructorChronologyRecord[]>`
    SELECT
        constructor_id,
        other_constructor_id,
        year_from,
        year_to
    FROM 
        constructor_chronology
    WHERE
        year_from BETWEEN ${fromYear} AND ${toYear}`

    return constructorChronologyRecords.reduce((acc: any, record: ConstructorChronologyRecord) => {
        const { constructor_id, other_constructor_id, year_from } = record;
        if ((acc[constructor_id]?.year_from || 0) < year_from) {
            acc[constructor_id] = { other_constructor_id, year_from };
        }
        return acc;
    }, {});
}

 export default constructorMap;