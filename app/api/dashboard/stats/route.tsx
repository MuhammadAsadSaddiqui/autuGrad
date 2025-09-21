import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

// GET /api/dashboard/stats - Get dashboard statistics
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

    // Get all statistics in parallel for better performance
    const [contentStats, mcqStats, studentStats, contentByType] =
      await Promise.all([
        // Total content count
        db.content.count({
          where: { userId: user.id },
        }),

        // Total MCQs count from completed sets
        db.mCQQuestion.count({
          where: {
            mcqSet: {
              userId: user.id,
            },
          },
        }),

        // Total students count
        db.student.count({
          where: { teacherId: user.id },
        }),

        // Content by file type
        db.content.groupBy({
          by: ["fileType"],
          where: { userId: user.id },
          _count: {
            fileType: true,
          },
        }),
      ]);

    // Process content by type
    const contentTypeStats = contentByType.reduce(
      (acc, item) => {
        const type = item.fileType.toLowerCase();
        if (type === "pdf") {
          acc.pdf = item._count.fileType;
        } else if (type === "pptx" || type === "ppt") {
          acc.pptx += item._count.fileType;
        }
        return acc;
      },
      { pdf: 0, pptx: 0 },
    );

    const stats = {
      totalContent: contentStats,
      totalMCQs: mcqStats,
      totalStudents: studentStats,
      contentByType: contentTypeStats,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
