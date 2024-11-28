import { PrismaClient } from '@prisma/client'
import { NextRequest } from "next/server";
import response from '@/utils/api/jsonResponse';
import getConstructorChronologies from '@/utils/api/constructorChronologies';
import getLatestConstructorMap from '@/utils/api/latestConstructorMap';

export async function POST(req: NextRequest) {
    const requestBody = await req.json();
    const constructors = requestBody.constructors || [];

    const prisma = new PrismaClient();

    const constructorChronology = await getConstructorChronologies(prisma, 1950, 2024);
    const latestConstructorMap = getLatestConstructorMap(constructorChronology);
    const mappedConstructors = constructors.reduce((acc: any, constructor_id: string) => {
        const latestMapping = latestConstructorMap[constructor_id];
        const latestId = latestMapping?.other_constructor_id || constructor_id;
        return { ...acc, [constructor_id]: latestId }
    }, {})

    return response(true, 200, mappedConstructors);
}