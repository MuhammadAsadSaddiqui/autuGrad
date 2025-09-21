// app/api/quiz/[id]/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAuthUser();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resolvedParams = await params;
    const mcqSetId = parseInt(resolvedParams.id);

    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: user.id,
        status: "completed",
      },
    });

    if (!mcqSet) {
      return NextResponse.json(
        { error: "Quiz not found or access denied" },
        { status: 404 },
      );
    }

    const questions = await db.mCQQuestion.findMany({
      where: { mcqSetId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz questions" },
      { status: 500 },
    );
  }
}
