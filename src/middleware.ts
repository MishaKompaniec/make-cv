import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";

const AUTH_PAGES = new Set(["/welcome"]);

function isValidToken(token: JWT | null): boolean {
  if (!token) return false;
  if (!token.sub || !token.email) return false;
  if (typeof token.exp === "number" && Date.now() / 1000 > token.exp)
    return false;
  return true;
}

function isPublicFile(pathname: string): boolean {
  const PUBLIC_FILES = ["/favicon.ico", "/robots.txt", "/sitemap.xml"];
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILES.includes(pathname)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicFile(pathname)) return NextResponse.next();

  const token = await getToken({ req });
  const isAuthed = isValidToken(token);

  if (!isAuthed && !AUTH_PAGES.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/welcome";

    const fullPath = pathname + search;
    url.searchParams.set("callbackUrl", fullPath);

    return NextResponse.redirect(url);
  }

  if (isAuthed && AUTH_PAGES.has(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
