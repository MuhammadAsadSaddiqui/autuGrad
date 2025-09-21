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
      where: {
        userId: user.id,
        status: "completed",
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
          select: {
            questions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mcqSets);
  } catch (error) {
    console.error("Error fetching quiz sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz sets" },
      { status: 500 },
    );
  }
}
