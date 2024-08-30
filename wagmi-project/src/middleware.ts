import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the user is trying to access a restricted section without a token
  if (!request.cookies.has("token") && !path.startsWith("/auth/signin")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
