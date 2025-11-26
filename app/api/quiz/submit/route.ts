// app/api/quiz/submit/route.ts
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

    // Calculate scores with negative marking
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unattempted = 0;
    const totalQuestions = quizCode.mcqSet.questions.length;

    // Calculate correct, wrong, and unattempted answers
    for (const question of quizCode.mcqSet.questions) {
      const studentAnswer = answers[question.id];

      if (!studentAnswer) {
        // Question was not attempted
        unattempted++;
      } else if (studentAnswer === question.answer) {
        // Correct answer
        correctAnswers++;
      } else {
        // Wrong answer
        wrongAnswers++;
      }
    }

    // Calculate score with negative marking
    // Correct answer: +1 mark
    // Wrong answer: -0.25 marks (negative marking)
    // Unattempted: 0 marks
    const NEGATIVE_MARKING = 0.25;
    const rawScore = correctAnswers - wrongAnswers * NEGATIVE_MARKING;
    const finalScore = Math.max(0, rawScore); // Score cannot be negative

    // Calculate percentage based on total questions
    const scorePercentage = Math.round((finalScore / totalQuestions) * 100);

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

    // Mark quiz code as used
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
      wrongAnswers,
      unattempted,
      totalQuestions,
      rawScore: rawScore.toFixed(2),
      finalScore: finalScore.toFixed(2),
      scorePercentage,
      grade,
      passed,
      timeSpent,
      negativeMarking: NEGATIVE_MARKING,
      breakdown: {
        correct: `${correctAnswers} × 1 = ${correctAnswers}`,
        wrong: `${wrongAnswers} × (-${NEGATIVE_MARKING}) = -${(wrongAnswers * NEGATIVE_MARKING).toFixed(2)}`,
        unattempted: `${unattempted} × 0 = 0`,
        total: `Final Score: ${finalScore.toFixed(2)}/${totalQuestions}`,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
