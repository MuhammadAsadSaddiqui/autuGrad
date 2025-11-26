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

    const [contentStats, mcqStats, studentStats, contentByType] =
      await Promise.all([
        db.content.count({
          where: { userId: user.id },
        }),

        db.mCQQuestion.count({
          where: {
            mcqSet: {
              userId: user.id,
            },
          },
        }),

        db.student.count({
          where: { teacherId: user.id },
        }),

        db.content.groupBy({
          by: ["fileType"],
          where: { userId: user.id },
          _count: {
            fileType: true,
          },
        }),
      ]);

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
