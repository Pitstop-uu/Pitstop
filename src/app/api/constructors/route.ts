import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    //const items = await prisma.$queryRaw<{ id: string, name: string}[]>`SELECT id, name FROM constructor`;
    const items = await prisma.$queryRaw<{ constructor_id: string}[]>`SELECT constructor_id, total_points FROM season_constructor WHERE year=${year}`;

    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }