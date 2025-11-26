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

    const [recentContent, recentMCQSets, recentStudents] = await Promise.all([
      // Recent content uploads
      db.content.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          title: true,
          fileName: true,
          fileType: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Recent MCQ sets
      db.mCQSet.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          status: true,
          totalQuestions: true,
          createdAt: true,
          content: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Recent students
      db.student.findMany({
        where: { teacherId: user.id },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    const activities = [];

    recentContent.forEach((content) => {
      activities.push({
        id: `content-${content.id}`,
        title: `${content.fileType.toUpperCase()} uploaded: ${content.title}`,
        status: content.status,
        createdAt: content.createdAt.toISOString(),
        type: "content",
      });
    });

    recentMCQSets.forEach((mcqSet) => {
      let title = `MCQ generation: ${mcqSet.name}`;
      if (mcqSet.status === "completed") {
        title = `Generated ${mcqSet.totalQuestions} MCQs from ${mcqSet.content.title}`;
      }
      activities.push({
        id: `mcq-${mcqSet.id}`,
        title,
        status: mcqSet.status,
        createdAt: mcqSet.createdAt.toISOString(),
        type: "mcq",
      });
    });

    recentStudents.forEach((student) => {
      activities.push({
        id: `student-${student.id}`,
        title: `New student added: ${student.name}`,
        status: "completed",
        createdAt: student.createdAt.toISOString(),
        type: "student",
      });
    });

    const sortedActivities = activities
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 },
    );
  }
}
