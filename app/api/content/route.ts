import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/authUser";

export async function GET(request: NextRequest) {
    try {
        
        const session = await getAuthUser();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        
        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        
        const content = await db.content.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        
        const formattedContent = content.map((item) => ({
            id: item.id,
            title: item.title,
            fileName: item.fileName,
            fileType: item.fileType,
            filePath: item.filePath,
            fileSize: item.fileSize,
            uploadDate: item.createdAt.toISOString(),
            mcqsGenerated: item.mcqsGenerated,
            status: item.status,
            userId: item.userId,
        }));

        return NextResponse.json(formattedContent);

    } catch (error) {
        console.error("Content fetch error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}