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

        
        const students = await db.student.findMany({
            where: {
                teacherId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const formattedStudents = students.map((student) => ({
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
        }));

        return NextResponse.json(formattedStudents);

    } catch (error) {
        console.error("Students fetch error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

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

        const body = await request.json();
        const { name, email, phone, department } = body;

        // Validate required fields
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
                email: email,
                teacherId: user.id,
            },
        });

        if (existingStudent) {
            return NextResponse.json(
                { message: "Student with this email already exists" },
                { status: 409 }
            );
        }

       
        const student = await db.student.create({
            data: {
                name,
                email,
                phone,
                department,
                teacherId: user.id,
                status: "active",
                totalQuizzes: 0,
                averageScore: 0,
                lastActivity: "Never",
            },
        });

        return NextResponse.json({
            message: "Student created successfully",
            data: student,
        });

    } catch (error) {
        console.error("Student creation error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}