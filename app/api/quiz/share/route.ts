import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";
import sendEmail from "@/lib/email.service";
import { generateVerificationToken } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mcqSetId, studentIds } = await request.json();

    if (!mcqSetId || !studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    // Verify MCQ set belongs to user
    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: parseInt(session.user.id),
        status: "completed",
      },
      include: {
        content: true,
        questions: true,
      },
    });

    if (!mcqSet) {
      return NextResponse.json({ error: "MCQ set not found" }, { status: 404 });
    }

    // Get students
    const students = await db.student.findMany({
      where: {
        id: { in: studentIds },
        teacherId: parseInt(session.user.id),
      },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { error: "No valid students found" },
        { status: 404 },
      );
    }

    // Create quiz codes for each student
    const quizCodes = [];

    for (const student of students) {
      const existingCode = await db.quizCode.findFirst({
        where: {
          studentId: student.id,
          mcqSetId: mcqSet.id,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
      });

      let quizCode;
      if (existingCode) {
        quizCode = existingCode;
      } else {
        const code = generateVerificationToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        quizCode = await db.quizCode.create({
          data: {
            code,
            studentId: student.id,
            mcqSetId: mcqSet.id,
            expiresAt,
            isUsed: false,
          },
        });
      }

      quizCodes.push({
        student,
        code: quizCode.code,
        quizUrl: `http://localhost:3000/quiz/attempt/${quizCode.code}`,
      });
      console.log(quizCodes);
      // Send email to student
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Quiz Invitation</h2>
          <p>Dear ${student.name},</p>
          <p>You have been invited to take a quiz: <strong>${mcqSet.name}</strong></p>
          <p><strong>Quiz Details:</strong></p>
          <ul>
            <li>Total Questions: ${mcqSet.totalQuestions}</li>
            <li>Time Limit: ${mcqSet.totalQuestions} minutes (1 minute per question)</li>
            <li>Valid Until: ${quizCode.expiresAt.toLocaleDateString()}</li>
          </ul>
          <p><strong>Your Quiz Code:</strong> <span style="background: #f0f0f0; padding: 5px 10px; font-weight: bold; font-size: 18px;">${quizCode.code}</span></p>
          <p><strong>Quiz Link:</strong> <spa style="color: #007bff;">https://localhost:3000/quiz/attempt/${quizCode.code}</spa></p>
          <p><strong>Important Instructions:</strong></p>
          <ul>
            <li>This code can only be used once</li>
            <li>You must complete the quiz in one session</li>
            <li>The quiz will be in secure mode - no other tabs can be opened</li>
            <li>Each question has a 1-minute time limit</li>
          </ul>
          <p>Good luck!</p>
        </div>
      `;

      await sendEmail({
        to: student.email,
        subject: `Quiz Invitation: ${mcqSet.name}`,
        htmlContent: emailHtml,
      });
    }

    return NextResponse.json({
      message: `Quiz invitations sent to ${students.length} students`,
      invitations: quizCodes.map((qc) => ({
        studentName: qc.student.name,
        studentEmail: qc.student.email,
        code: qc.code,
      })),
    });
  } catch (error) {
    console.error("Error sharing quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
