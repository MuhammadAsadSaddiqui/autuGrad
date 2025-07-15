import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/authUser";

export async function PUT(
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

        const studentId = parseInt(params.id);

        if (isNaN(studentId)) {
            return NextResponse.json(
                { message: "Invalid student ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, email, phone, department, status } = body;

        if (!name || !email || !phone || !department) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        const existingStudent = await db.student.findFirst({
            where: {
                id: studentId,
                teacherId: user.id,
            },
        });

        if (!existingStudent) {
            return NextResponse.json(
                { message: "Student not found or access denied" },
                { status: 404 }
            );
        }

        if (email !== existingStudent.email) {
            const emailConflict = await db.student.findFirst({
                where: {
                    email: email,
                    teacherId: user.id,
                    id: { not: studentId },
                },
            });

            if (emailConflict) {
                return NextResponse.json(
                    { message: "Another student with this email already exists" },
                    { status: 409 }
                );
            }
        }

        const updatedStudent = await db.student.update({
            where: {
                id: studentId,
            },
            data: {
                name,
                email,
                phone,
                department,
                status: status || existingStudent.status,
            },
        });

        return NextResponse.json({
            message: "Student updated successfully",
            data: updatedStudent,
        });

    } catch (error) {
        console.error("Student update error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

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

        const studentId = parseInt(params.id);

        if (isNaN(studentId)) {
            return NextResponse.json(
                { message: "Invalid student ID" },
                { status: 400 }
            );
        }

        const student = await db.student.findFirst({
            where: {
                id: studentId,
                teacherId: user.id,
            },
        });

        if (!student) {
            return NextResponse.json(
                { message: "Student not found or access denied" },
                { status: 404 }
            );
        }

        await db.student.delete({
            where: {
                id: studentId,
            },
        });

        return NextResponse.json({
            message: "Student deleted successfully",
        });

    } catch (error) {
        console.error("Student deletion error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication
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

        const studentId = parseInt(params.id);

        if (isNaN(studentId)) {
            return NextResponse.json(
                { message: "Invalid student ID" },
                { status: 400 }
            );
        }

        
        const student = await db.student.findFirst({
            where: {
                id: studentId,
                teacherId: user.id,
            },
        });

        if (!student) {
            return NextResponse.json(
                { message: "Student not found or access denied" },
                { status: 404 }
            );
        }

        
        const formattedStudent = {
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            enrollmentDate: student.createdAt.toISOString().split('T')[0],
            totalQuizzes: student.totalQuizzes,
            averageScore: student.averageScore,
            lastActivity: student.lastActivity,
            status: student.status,
            department: student.department,
            createdAt: student.createdAt.toISOString(),
            updatedAt: student.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedStudent);

    } catch (error) {
        console.error("Student fetch error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}