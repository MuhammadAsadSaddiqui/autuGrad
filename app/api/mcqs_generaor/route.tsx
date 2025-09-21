import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const mcqs = await db.mCQ.findMany();
    return NextResponse.json(mcqs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
