import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mcq_set_id, mcqs, success, error } = body;

    console.log("Webhook received:", {
      mcq_set_id,
      success,
      mcqsCount: mcqs?.length,
      error,
    });

    if (!mcq_set_id) {
      return NextResponse.json(
        { error: "MCQ Set ID is required" },
        { status: 400 },
      );
    }

    // Find the MCQ set
    const mcqSet = await db.mCQSet.findUnique({
      where: { id: mcq_set_id },
      include: { content: true },
    });

    if (!mcqSet) {
      return NextResponse.json({ error: "MCQ Set not found" }, { status: 404 });
    }

    if (success && mcqs && Array.isArray(mcqs)) {
      // Validate and prepare MCQ questions for database
      const validMcqs = mcqs.filter(
        (mcq) =>
          mcq.question &&
          mcq.options &&
          Array.isArray(mcq.options) &&
          mcq.options.length === 4 &&
          mcq.answer &&
          ["A", "B", "C", "D"].includes(mcq.answer.toUpperCase()),
      );

      if (validMcqs.length === 0) {
        // No valid MCQs found, mark as failed
        await db.mCQSet.update({
          where: { id: mcq_set_id },
          data: {
            status: "failed",
          },
        });

        return NextResponse.json({
          success: false,
          message: "No valid MCQs found in the generated data",
        });
      }

      // Prepare questions for database insertion
      const questions = validMcqs.map((mcq: any) => ({
        question: mcq.question.trim(),
        optionA: mcq.options[0].trim(),
        optionB: mcq.options[1].trim(),
        optionC: mcq.options[2].trim(),
        optionD: mcq.options[3].trim(),
        answer: mcq.answer.toUpperCase(),
        mcqSetId: mcq_set_id,
      }));

      // Store MCQs in database using transaction
      await db.$transaction([
        // Insert all MCQ questions
        db.mCQQuestion.createMany({
          data: questions,
        }),
        // Update MCQ set status
        db.mCQSet.update({
          where: { id: mcq_set_id },
          data: {
            status: "completed",
            totalQuestions: validMcqs.length,
          },
        }),
        // Update content MCQ count
        db.content.update({
          where: { id: mcqSet.contentId },
          data: {
            status: "completed",
            mcqsGenerated: {
              increment: validMcqs.length,
            },
          },
        }),
      ]);

      console.log(
        `Successfully stored ${validMcqs.length} MCQs for set ${mcq_set_id}`,
      );

      return NextResponse.json({
        success: true,
        message: `Successfully stored ${validMcqs.length} MCQs`,
        totalQuestions: validMcqs.length,
        mcqSetId: mcq_set_id,
      });
    } else {
      // Generation failed
      await db.mCQSet.update({
        where: { id: mcq_set_id },
        data: {
          status: "failed",
        },
      });

      console.log(`MCQ generation failed for set ${mcq_set_id}: ${error}`);

      return NextResponse.json({
        success: false,
        message: error || "MCQ generation failed",
        mcqSetId: mcq_set_id,
      });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Try to update MCQ set status to failed if we have the ID
    const body = await request.json().catch(() => ({}));
    if (body.mcq_set_id) {
      try {
        await db.mCQSet.update({
          where: { id: body.mcq_set_id },
          data: { status: "failed" },
        });
      } catch (updateError) {
        console.error("Failed to update MCQ set status:", updateError);
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
