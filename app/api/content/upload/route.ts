import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/authUser";

export async function POST(request: NextRequest) {
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

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { message: "No file provided" },
                { status: 400 }
            );
        }

        const validTypes = [
            "application/pdf",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ];

        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { message: "Only PDF and PPTX files are supported" },
                { status: 400 }
            );
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { message: "File size must be less than 10MB" },
                { status: 400 }
            );
        }

        const contentDir = path.join(process.cwd(), "content");
        if (!existsSync(contentDir)) {
            await mkdir(contentDir, { recursive: true });
        }

        const timestamp = Date.now();
        const fileExtension = path.extname(file.name);
        const nameWithoutExt = path.basename(file.name, fileExtension);
        const fileName = `${nameWithoutExt}_${timestamp}${fileExtension}`;
        const filePath = path.join(contentDir, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        const fileType = file.type === "application/pdf" ? "PDF" : "PPTX";

        const contentRecord = await db.content.create({
            data: {
                title: nameWithoutExt,
                fileName: file.name,
                fileType: fileType,
                filePath: path.relative(process.cwd(), filePath),
                fileSize: file.size,
                userId: user.id,
                status: "processed",
                mcqsGenerated: 0,
            },
        });

        return NextResponse.json({
            message: "File uploaded successfully",
            data: contentRecord,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}