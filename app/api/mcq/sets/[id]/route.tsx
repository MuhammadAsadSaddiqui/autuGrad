// app/api/mcq/sets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

// DELETE endpoint - Delete an MCQ set
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getAuthUser();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    const mcqSetId = parseInt(params.id);

    if (isNaN(mcqSetId)) {
      return NextResponse.json(
        { error: "Invalid MCQ set ID" },
        { status: 400 },
      );
    }

    // First, verify the MCQ set exists and belongs to the user
    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: parseInt(session.user.id),
      },
    });

    if (!mcqSet) {
      return NextResponse.json(
        { error: "MCQ set not found or access denied" },
        { status: 404 },
      );
    }

    // Delete all questions first (if cascade is not set up)
    await db.mCQQuestion.deleteMany({
      where: { mcqSetId: mcqSetId },
    });

    // Then delete the MCQ set
    await db.mCQSet.delete({
      where: { id: mcqSetId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "MCQ set deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting MCQ set:", error);

    return NextResponse.json(
      {
        error: "Failed to delete MCQ set",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET endpoint - Get single MCQ set details
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

    if (isNaN(mcqSetId)) {
      return NextResponse.json(
        { error: "Invalid MCQ set ID" },
        { status: 400 },
      );
    }

    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: parseInt(session.user.id),
      },
      include: {
        content: {
          select: {
            title: true,
            fileName: true,
            fileType: true,
          },
        },
        _count: {
          select: { questions: true },
        },
      },
    });

    if (!mcqSet) {
      return NextResponse.json({ error: "MCQ set not found" }, { status: 404 });
    }

    return NextResponse.json(mcqSet, { status: 200 });
  } catch (error) {
    console.error("Error fetching MCQ set:", error);
    return NextResponse.json(
      { error: "Failed to fetch MCQ set" },
      { status: 500 },
    );
  }
}

// PATCH endpoint - Update MCQ set (optional)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getAuthUser();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mcqSetId = parseInt(params.id);

    if (isNaN(mcqSetId)) {
      return NextResponse.json(
        { error: "Invalid MCQ set ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, description, status } = body;

    // Verify ownership
    const existingMcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        userId: parseInt(session.user.id),
      },
    });

    if (!existingMcqSet) {
      return NextResponse.json(
        { error: "MCQ set not found or access denied" },
        { status: 404 },
      );
    }

    // Update the MCQ set
    const updatedMcqSet = await db.mCQSet.update({
      where: { id: mcqSetId },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(status && { status }),
      },
      include: {
        content: {
          select: {
            title: true,
            fileName: true,
            fileType: true,
          },
        },
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json(updatedMcqSet, { status: 200 });
  } catch (error) {
    console.error("Error updating MCQ set:", error);
    return NextResponse.json(
      { error: "Failed to update MCQ set" },
      { status: 500 },
    );
  }
}
