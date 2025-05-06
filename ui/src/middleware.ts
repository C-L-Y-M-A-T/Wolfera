import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware triggered for request:", req.url);
  console.log("req.cookies", req);
  const accessToken = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  console.log("req.cookies", req.cookies);
  if (!accessToken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
