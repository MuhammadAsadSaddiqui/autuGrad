// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const privateRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/unverified",
  "/quiz",
];

const authRoutes = ["/login", "/register", "/forgotpass", "/signup"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (!privateRoutes.some(route => path.startsWith(route)) && !authRoutes.includes(path) && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
    
  if (!token && privateRoutes.some((route) => path.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }
  
  if (token && authRoutes.some((route) => path === route)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};