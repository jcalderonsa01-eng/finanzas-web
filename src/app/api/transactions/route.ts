import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db.select().from(transactions).orderBy(desc(transactions.date));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [row] = await db.insert(transactions).values(body).returning();
  return NextResponse.json(row, { status: 201 });
}
