import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup"];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("sb-access-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
