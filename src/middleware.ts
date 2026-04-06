import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // If visiting space.open-bln.com at root, rewrite to /community
  if (
    (hostname.startsWith("space.") || hostname.startsWith("space-")) &&
    pathname === "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/community";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
