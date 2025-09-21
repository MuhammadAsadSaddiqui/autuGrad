import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mcqSets = await db.mCQSet.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        content: {
          select: {
            title: true,
            fileName: true,
            fileType: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mcqSets);
  } catch (error) {
    console.error("Error fetching MCQ sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch MCQ sets" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, contentId } = await request.json();

    if (!name || !contentId) {
      return NextResponse.json(
        { error: "Name and content ID are required" },
        { status: 400 },
      );
    }

    // Verify content exists and belongs to the user
    const content = await db.content.findFirst({
      where: {
        id: contentId,
        userId: parseInt(session.user.id),
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Content not found or access denied" },
        { status: 404 },
      );
    }

    // Check if content is processed and ready for MCQ generation
    if (content.status !== "processed" && content.status !== "completed") {
      return NextResponse.json(
        { error: "Content must be processed before generating MCQs" },
        { status: 400 },
      );
    }

    // Create the MCQ set
    const mcqSet = await db.mCQSet.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: parseInt(session.user.id),
        contentId,
        status: "pending",
      },
      include: {
        content: {
          select: {
            title: true,
            fileName: true,
            fileType: true,
          },
        },
      },
    });

    return NextResponse.json(mcqSet);
  } catch (error) {
    console.error("Error creating MCQ set:", error);
    return NextResponse.json(
      { error: "Failed to create MCQ set" },
      { status: 500 },
    );
  }
}
