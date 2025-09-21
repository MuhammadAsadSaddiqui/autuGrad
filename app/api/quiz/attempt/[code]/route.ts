// api/quiz/attempt/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const { code } = params;

    const quizCode = await db.quizCode.findFirst({
      where: {
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        student: true,
        mcqSet: {
          include: {
            questions: {
              select: {
                id: true,
                question: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
              },
            },
            content: true,
          },
        },
      },
    });

    if (!quizCode) {
      return NextResponse.json(
        { error: "Invalid or expired quiz code" },
        { status: 404 },
      );
    }

    // Check if student already attempted this quiz
    const existingAttempt = await db.quizAttempt.findFirst({
      where: {
        studentId: quizCode.studentId,
        mcqSetId: quizCode.mcqSetId,
      },
    });

    if (existingAttempt) {
      return NextResponse.json(
        { error: "Quiz already attempted" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      student: quizCode.student,
      mcqSet: {
        id: quizCode.mcqSet.id,
        name: quizCode.mcqSet.name,
        description: quizCode.mcqSet.description,
        totalQuestions: quizCode.mcqSet.totalQuestions,
        questions: quizCode.mcqSet.questions,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
