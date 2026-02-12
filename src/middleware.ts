import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PAGES = new Set(["/welcome"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname === "/favicon.ico") return NextResponse.next();
  if (pathname === "/robots.txt") return NextResponse.next();
  if (pathname === "/sitemap.xml") return NextResponse.next();

  const token = await getToken({ req });
  const isAuthed = !!token;

  if (!isAuthed && !AUTH_PAGES.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/welcome";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthed && AUTH_PAGES.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
