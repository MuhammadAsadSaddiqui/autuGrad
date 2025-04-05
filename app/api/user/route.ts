import { NextResponse } from "next/server";
import { register } from "@/app/(public)/signup/action/register";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password } = body;
    const response = await register({
      fullName,
      email,
      password,
    });
    if (response.status !== 200) {
      return NextResponse.json(
        {
          message: response.message,
          data: response.data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 },
    );
  }
}
