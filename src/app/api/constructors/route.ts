import { PrismaClient, Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    const years = year ? year.split(',').map(Number) : [];
    let lowerBound: number | undefined;
    let upperBound: number | undefined;
    if (year) {
      const yearRange = year.split(',').map(Number).sort((a, b) => a - b); 
      lowerBound = yearRange[0];
      upperBound = yearRange[1] || lowerBound; 
  }
    //const items = await prisma.$queryRaw<{ id: string, name: string}[]>`SELECT id, name FROM constructor`;
    //const items = await prisma.$queryRaw<{ constructor_id: string}[]>`SELECT constructor_id, total_points, year FROM season_constructor WHERE year=${year}`;
    //const items = await prisma.$queryRaw<{ constructor_id: string, total_points: string, year: number }[]>`
    //SELECT constructor_id, total_points, year 
    //FROM season_constructor 
    //WHERE year IN (${Prisma.join(years)})
    //`;
    const items = await prisma.$queryRaw<{ constructor_id: string, total_points: string, year: number }[]>`
    SELECT constructor_id, total_points, year 
    FROM season_constructor 
    WHERE year BETWEEN ${lowerBound} AND ${upperBound}`;

    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }