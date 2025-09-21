// api/quiz/results/[mcqSetId]/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUser";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { mcqSetId: string } },
) {
  try {
    const session = await getAuthUser();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mcqSetId = parseInt(params.mcqSetId);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";

    // Verify MCQ set belongs to user
    const mcqSet = await db.mCQSet.findFirst({
      where: {
        id: mcqSetId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        userId: parseInt(session.user.id),
      },
      include: {
        content: true,
      },
    });

    if (!mcqSet) {
      return NextResponse.json({ error: "MCQ set not found" }, { status: 404 });
    }

    // Get quiz attempts with student details
    const attempts = await db.quizAttempt.findMany({
      where: {
        mcqSetId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        userId: parseInt(session.user.id),
      },
      include: {
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (format === "csv") {
      // Generate CSV
      const csvHeaders = [
        "Student Name",
        "Email",
        "Department",
        "Score",
        "Total Questions",
        "Percentage",
        "Grade",
        "Status",
        "Time Spent (minutes)",
        "Submitted At",
      ];

      const csvRows = attempts.map((attempt) => [
        attempt.student?.name || "Unknown",
        attempt.student?.email || "Unknown",
        attempt.student?.department || "Unknown",
        attempt.score.toString(),
        attempt.totalQuestions.toString(),
        `${attempt.scorePercentage}%`,
        attempt.grade,
        attempt.passed ? "Passed" : "Failed",
        Math.round(attempt.timeSpent / 60).toString(),
        new Date(attempt.createdAt).toLocaleString(),
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.map((field) => `"${field}"`).join(",")),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${mcqSet.name}_results.csv"`,
        },
      });
    }

    if (format === "pdf") {
      // For PDF, you would typically use a library like puppeteer or jsPDF
      // For now, return a structured data that can be used to generate PDF on frontend
      const pdfData = {
        title: `${mcqSet.name} - Quiz Results`,
        subtitle: `${mcqSet.content.title}`,
        generatedAt: new Date().toLocaleString(),
        summary: {
          totalAttempts: attempts.length,
          averageScore:
            attempts.length > 0
              ? Math.round(
                  attempts.reduce((sum, a) => sum + a.scorePercentage, 0) /
                    attempts.length,
                )
              : 0,
          passedCount: attempts.filter((a) => a.passed).length,
          passRate:
            attempts.length > 0
              ? Math.round(
                  (attempts.filter((a) => a.passed).length / attempts.length) *
                    100,
                )
              : 0,
        },
        results: attempts.map((attempt) => ({
          studentName: attempt.student?.name || "Unknown",
          email: attempt.student?.email || "Unknown",
          department: attempt.student?.department || "Unknown",
          score: `${attempt.score}/${attempt.totalQuestions}`,
          percentage: `${attempt.scorePercentage}%`,
          grade: attempt.grade,
          status: attempt.passed ? "Passed" : "Failed",
          timeSpent: `${Math.round(attempt.timeSpent / 60)} minutes`,
          submittedAt: new Date(attempt.createdAt).toLocaleString(),
        })),
      };

      return NextResponse.json(pdfData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${mcqSet.name}_results.json"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting quiz results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
