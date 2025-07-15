// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { auth } from "@/lib/auth";
//
// const prisma = new PrismaClient();
//
// // GET /api/profile
// export async function GET() {
//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//
//     const profile = await prisma.profile.findUnique({
//       where: {
//         userId: session.user.id,
//       },
//       include: {
//         user: {
//           select: {
//             email: true,
//             name: true,
//             image: true,
//           },
//         },
//       },
//     });
//
//     if (!profile) {
//       return NextResponse.json({ error: "Profile not found" }, { status: 404 });
//     }
//
//     return NextResponse.json(profile);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch profile" },
//       { status: 500 },
//     );
//   }
// }
//
// // PUT /api/profile
// export async function PUT(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//
//     const data = await req.json();
//
//     const profile = await prisma.profile.upsert({
//       where: {
//         userId: session.user.id,
//       },
//       update: {
//         fullName: data.fullName,
//         phone: data.phone,
//         department: data.department,
//         institution: data.institution,
//         imageUrl: data.imageUrl,
//       },
//       create: {
//         userId: session.user.id,
//         fullName: data.fullName,
//         phone: data.phone,
//         department: data.department,
//         institution: data.institution,
//         imageUrl: data.imageUrl,
//       },
//     });
//
//     return NextResponse.json(profile);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update profile" },
//       { status: 500 },
//     );
//   }
// }
