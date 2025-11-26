import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
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

    const mcqSets = await db.mCQSet.findMany({
      where: { userId: user.id },
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { name, description, contentId } = await request.json();

    if (!name || !contentId) {
      return NextResponse.json(
        { error: "Name and content ID are required" },
        { status: 400 },
      );
    }

    const content = await db.content.findFirst({
      where: {
        id: parseInt(contentId),
        userId: user.id,
      },
    });
    console.log(content, "contemt");
    if (!content) {
      return NextResponse.json(
        { error: "Content not found or access denied" },
        { status: 404 },
      );
    }

    if (content.status !== "processed" && content.status !== "completed") {
      return NextResponse.json(
        { error: "Content must be processed before generating MCQs" },
        { status: 400 },
      );
    }

    const mcqSet = await db.mCQSet.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: user.id,
        contentId: parseInt(contentId),
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
