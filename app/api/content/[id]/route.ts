import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/authUser";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const contentId = parseInt(params.id);

        if (isNaN(contentId)) {
            return NextResponse.json(
                { message: "Invalid content ID" },
                { status: 400 }
            );
        }

        
        const content = await db.content.findFirst({
            where: {
                id: contentId,
                userId: user.id,
            },
        });

        if (!content) {
            return NextResponse.json(
                { message: "Content not found or access denied" },
                { status: 404 }
            );
        }

        const fullPath = path.join(process.cwd(), content.filePath);
        if (existsSync(fullPath)) {
            await unlink(fullPath);
        }

        
        await db.content.delete({
            where: {
                id: contentId,
            },
        });

        return NextResponse.json({
            message: "Content deleted successfully",
        });

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}