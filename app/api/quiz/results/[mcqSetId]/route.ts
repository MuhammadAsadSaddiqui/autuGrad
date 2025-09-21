import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { mcqSetId: string } },
) {
  try {
    const session = await getAuthUser();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mcqSetId = parseInt(params.mcqSetId);

    // Verify MCQ set belongs to user
    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: parseInt(session.user.id),
      },
      include: {
        content: true,
      },
    });

    if (!mcqSet) {
      return NextResponse.json({ error: "MCQ set not found" }, { status: 404 });
    }

    // Get quiz attempts with student details
    const attempts = await db.quizAttempt.findMany({
      where: {
        mcqSetId,
        userId: parseInt(session.user.id),
      },
      include: {
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get quiz codes (sent invitations)
    const quizCodes = await db.quizCode.findMany({
      where: {
        mcqSetId,
      },
      include: {
        student: true,
      },
    });

    const results = attempts.map((attempt) => ({
      id: attempt.id,
      student: {
        name: attempt.student?.name || "Unknown",
        email: attempt.student?.email || "Unknown",
        department: attempt.student?.department || "Unknown",
      },
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      scorePercentage: attempt.scorePercentage,
      grade: attempt.grade,
      passed: attempt.passed,
      timeSpent: attempt.timeSpent,
      submittedAt: attempt.createdAt,
    }));

    const invitations = quizCodes.map((code) => ({
      student: {
        name: code.student.name,
        email: code.student.email,
        department: code.student.department,
      },
      code: code.code,
      isUsed: code.isUsed,
      usedAt: code.usedAt,
      expiresAt: code.expiresAt,
      sentAt: code.createdAt,
    }));

    return NextResponse.json({
      mcqSet: {
        id: mcqSet.id,
        name: mcqSet.name,
        description: mcqSet.description,
        totalQuestions: mcqSet.totalQuestions,
        content: mcqSet.content,
      },
      results,
      invitations,
      stats: {
        totalInvitations: invitations.length,
        totalAttempts: results.length,
        averageScore:
          results.length > 0
            ? Math.round(
                results.reduce((sum, r) => sum + r.scorePercentage, 0) /
                  results.length,
              )
            : 0,
        passedCount: results.filter((r) => r.passed).length,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
