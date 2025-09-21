import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { code, answers, timeSpent } = await request.json();

    if (!code || !answers || typeof timeSpent !== "number") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const quizCode = await db.quizCode.findFirst({
      where: {
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        mcqSet: {
          include: {
            questions: true,
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

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quizCode.mcqSet.questions.length;

    for (const question of quizCode.mcqSet.questions) {
      const studentAnswer = answers[question.id];
      if (studentAnswer === question.answer) {
        correctAnswers++;
      }
    }

    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const grade =
      scorePercentage >= 80
        ? "A"
        : scorePercentage >= 70
          ? "B"
          : scorePercentage >= 60
            ? "C"
            : scorePercentage >= 50
              ? "D"
              : "F";
    const passed = scorePercentage >= 50;

    // Save quiz attempt
    await db.quizAttempt.create({
      data: {
        userId: quizCode.mcqSet.userId, // Teacher's ID
        studentId: quizCode.studentId,
        mcqSetId: quizCode.mcqSetId,
        score: correctAnswers,
        totalQuestions,
        scorePercentage,
        timeSpent,
        answers: JSON.stringify(answers),
        grade,
        passed,
      },
    });
    await db.quizCode.update({
      where: { id: quizCode.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    // Update student's total quizzes count
    await db.student.update({
      where: { id: quizCode.studentId },
      data: {
        totalQuizzes: { increment: 1 },
        lastActivity: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      score: correctAnswers,
      totalQuestions,
      scorePercentage,
      grade,
      passed,
      timeSpent,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
