import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { initialize } from "@/lib/temporal_client";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId");
    const mcqSetId = searchParams.get("mcqSetId");

    if (!workflowId && !mcqSetId) {
      return NextResponse.json(
        { error: "Workflow ID or MCQ Set ID required" },
        { status: 400 },
      );
    }

    const { db } = await import("@/lib/db");

    // If MCQ Set ID is provided, check status directly from database
    if (mcqSetId) {
      const mcqSet = await db.mCQSet.findFirst({
        where: {
          id: parseInt(mcqSetId),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          userId: parseInt(session.user.id),
        },
        include: {
          content: {
            select: {
              title: true,
            },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

      if (!mcqSet) {
        return NextResponse.json(
          { error: "MCQ set not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        status: mcqSet.status,
        mcqSetId: mcqSet.id,
        workflowId: mcqSet.workflowId,
        totalQuestions: mcqSet.totalQuestions,
        questionsGenerated: mcqSet._count.questions,
        contentTitle: mcqSet.content.title,
        createdAt: mcqSet.createdAt,
        updatedAt: mcqSet.updatedAt,
      });
    }

    // If workflow ID is provided, check Temporal workflow status
    if (workflowId) {
      try {
        const client = await initialize();
        const handle = client.workflow.getHandle(workflowId);

        try {
          const result = await handle.result();

          // Workflow completed successfully
          if (result.success && result.mcqs) {
            return NextResponse.json({
              status: "completed",
              workflowId,
              result: {
                success: true,
                totalQuestions: result.total_questions,
                mcqSetId: result.mcq_set_id,
              },
            });
          } else {
            return NextResponse.json({
              status: "failed",
              workflowId,
              error: result.error || "MCQ generation failed",
            });
          }
        } catch {
          // Workflow is still running or in other state
          const description = await handle.describe();

          return NextResponse.json({
            status: description.status.name.toLowerCase(),
            workflowId,
            workflowStatus: description.status.name,
          });
        }
      } catch (error) {
        console.error("Error checking workflow status:", error);
        return NextResponse.json({
          status: "unknown",
          workflowId,
          error: "Failed to check workflow status",
        });
      }
    }
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 },
    );
  }
}
