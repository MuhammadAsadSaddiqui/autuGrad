// app/api/quiz/[id]/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

interface SubmissionData {
  answers: { [questionId: number]: string };
  timeSpent: number;
}

export async function POST(
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
    const { answers, timeSpent }: SubmissionData = await request.json();

    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: user.id,
        status: "completed",
      },
      include: {
        content: {
          select: {
            title: true,
          },
        },
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

    // Calculate scores with negative marking
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unattempted = 0;
    const detailedResults = questions.map((question) => {
      const userAnswer = answers[question.id];
      let isCorrect = false;
      let status = "unattempted";

      if (!userAnswer) {
        unattempted++;
        status = "unattempted";
      } else if (userAnswer === question.answer) {
        correctAnswers++;
        isCorrect = true;
        status = "correct";
      } else {
        wrongAnswers++;
        status = "wrong";
      }

      return {
        questionId: question.id,
        question: question.question,
        options: {
          A: question.optionA,
          B: question.optionB,
          C: question.optionC,
          D: question.optionD,
        },
        correctAnswer: question.answer,
        userAnswer: userAnswer || null,
        isCorrect,
        status,
      };
    });

    const totalQuestions = questions.length;

    // Calculate score with negative marking
    // Correct answer: +1 mark
    // Wrong answer: -0.25 marks (negative marking)
    // Unattempted: 0 marks
    const NEGATIVE_MARKING = 0.25;
    const rawScore = correctAnswers - wrongAnswers * NEGATIVE_MARKING;
    const finalScore = Math.max(0, rawScore); // Score cannot be negative

    // Calculate percentage based on total questions
    const scorePercentage = Math.round((finalScore / totalQuestions) * 100);

    let grade = "F";
    if (scorePercentage >= 90) grade = "A";
    else if (scorePercentage >= 80) grade = "B";
    else if (scorePercentage >= 70) grade = "C";
    else if (scorePercentage >= 60) grade = "D";

    const quizAttempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        mcqSetId: mcqSetId,
        score: correctAnswers,
        totalQuestions: totalQuestions,
        scorePercentage: scorePercentage,
        timeSpent: timeSpent,
        answers: JSON.stringify(answers),
        grade: grade,
        passed: scorePercentage >= 60,
      },
    });

    return NextResponse.json({
      success: true,
      attemptId: quizAttempt.id,
      results: {
        correctAnswers,
        wrongAnswers,
        unattempted,
        totalQuestions,
        rawScore: rawScore.toFixed(2),
        finalScore: finalScore.toFixed(2),
        scorePercentage,
        grade,
        timeSpent,
        quizName: mcqSet.name,
        contentTitle: mcqSet.content.title,
        detailedResults,
        passed: scorePercentage >= 60,
        negativeMarking: NEGATIVE_MARKING,
        breakdown: {
          correct: `${correctAnswers} × 1 = ${correctAnswers}`,
          wrong: `${wrongAnswers} × (-${NEGATIVE_MARKING}) = -${(wrongAnswers * NEGATIVE_MARKING).toFixed(2)}`,
          unattempted: `${unattempted} × 0 = 0`,
          total: `Final Score: ${finalScore.toFixed(2)}/${totalQuestions}`,
        },
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 },
    );
  }
}
