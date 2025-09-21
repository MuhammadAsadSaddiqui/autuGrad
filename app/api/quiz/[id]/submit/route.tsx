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

    let correctAnswers = 0;
    const detailedResults = questions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.answer;

      if (isCorrect) {
        correctAnswers++;
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
      };
    });

    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

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
        score: correctAnswers,
        totalQuestions: totalQuestions,
        scorePercentage: scorePercentage,
        grade: grade,
        timeSpent: timeSpent,
        quizName: mcqSet.name,
        contentTitle: mcqSet.content.title,
        detailedResults: detailedResults,
        passed: scorePercentage >= 60,
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
