import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mcqSetId = parseInt(params.id);

    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        userId: parseInt(session.user.id),
      },
      include: {
        content: {
          select: {
            title: true,
            fileName: true,
          },
        },
        questions: {
          orderBy: { id: "asc" },
        },
      },
    });

    if (!mcqSet) {
      return NextResponse.json({ error: "MCQ set not found" }, { status: 404 });
    }

    const exportData = {
      metadata: {
        setName: mcqSet.name,
        description: mcqSet.description,
        sourceContent: mcqSet.content.title,
        sourceFile: mcqSet.content.fileName,
        totalQuestions: mcqSet.totalQuestions,
        createdAt: mcqSet.createdAt,
        exportedAt: new Date().toISOString(),
      },
      mcqs: mcqSet.questions.map((q, index) => ({
        questionNumber: index + 1,
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.answer,
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const buffer = Buffer.from(jsonString, "utf-8");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${mcqSet.name.replace(/[^a-z0-9]/gi, "_")}_mcqs.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting MCQ set:", error);
    return NextResponse.json(
      { error: "Failed to export MCQ set" },
      { status: 500 },
    );
  }
}
