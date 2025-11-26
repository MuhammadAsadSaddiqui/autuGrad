import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { initialize } from "@/lib/temporal_client";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mcqSetId, numQuestions } = await request.json();

    if (!mcqSetId || !numQuestions) {
      return NextResponse.json(
        { error: "MCQ Set ID and number of questions are required" },
        { status: 400 },
      );
    }

    const { db } = await import("@/lib/db");

    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: parseInt(mcqSetId),
        userId: parseInt(session.user.id), 
      },
      include: {
        content: true,
      },
    });
    console.log(mcqSet, "mcqset");

    if (!mcqSet) {
      return NextResponse.json({ error: "MCQ set not found" }, { status: 404 });
    }

    if (mcqSet.status === "generating") {
      return NextResponse.json(
        { error: "MCQ set is already being processed" },
        { status: 400 },
      );
    }

    if (mcqSet.status === "completed") {
      return NextResponse.json(
        { error: "MCQ set is already completed" },
        { status: 400 },
      );
    }

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/content/download?path=${encodeURIComponent(mcqSet.content.filePath)}`;
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/mcq/webhook`;

    const client = await initialize();
    const workflowId = `mcq-generation-${mcqSetId}-${Date.now()}`;

    await client.workflow.start("MCQGenerationWorkflow", {
      taskQueue: "mcq-queue",
      workflowId,
      args: [
        {
          url,
          num_questions: numQuestions,
          mcq_set_id: mcqSetId,
          webhook_url: webhookUrl,
        },
      ],
    });

    await db.mCQSet.update({
      where: { id: mcqSetId },
      data: {
        status: "generating",
        workflowId: workflowId,
      },
    });

    return NextResponse.json({
      success: true,
      workflowId,
      mcqSetId,
      message: "MCQ generation started successfully",
    });
  } catch (error) {
    console.error("MCQ generation error:", error);
    return NextResponse.json(
      { error: "Failed to start MCQ generation" },
      { status: 500 },
    );
  }
}
