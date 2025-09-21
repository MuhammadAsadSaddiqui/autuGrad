import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getAuthUser();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from database using email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const mcqSetId = parseInt(params.id);
    console.log(`Fetching questions for MCQ set ID: ${mcqSetId}`);

    // First check if the MCQ set exists and belongs to the user
    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: user.id,
      },
    });

    console.log(`MCQ Set found:`, mcqSet);

    if (!mcqSet) {
      return NextResponse.json(
        { error: "MCQ set not found or access denied" },
        { status: 404 },
      );
    }

    // Now fetch the questions using the correct model name
    const questions = await db.mCQQuestion.findMany({
      where: { mcqSetId },
      orderBy: { id: "asc" },
    });

    console.log(`Found ${questions.length} questions for MCQ set ${mcqSetId}`);

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching MCQ questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}
