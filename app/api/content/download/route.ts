import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
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

        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get("path");

        if (!filePath) {
            return NextResponse.json(
                { message: "File path is required" },
                { status: 400 }
            );
        }

        
        const content = await db.content.findFirst({
            where: {
                filePath: filePath,
                userId: user.id,
            },
        });

        if (!content) {
            return NextResponse.json(
                { message: "File not found or access denied" },
                { status: 404 }
            );
        }

        
        const fullPath = path.join(process.cwd(), filePath);

        
        if (!existsSync(fullPath)) {
            return NextResponse.json(
                { message: "File not found on disk" },
                { status: 404 }
            );
        }

        
        const fileBuffer = await readFile(fullPath);

        
        const contentType = content.fileType === "PDF"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.presentationml.presentation";

       
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${content.fileName}"`,
                "Content-Length": fileBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error("Download error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}