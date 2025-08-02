import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const pathname = req.nextUrl.pathname;

    const adminOnlyRoutes = ['/users', '/requests', '/reported-items','/admins'];

    if (
        adminOnlyRoutes.some((route) => pathname.startsWith(route)) &&
        token.role !== 'admin'
    ) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/feed',
        '/settings',
        '/inbox',
        '/saved',
        '/notifications',
        '/users/:path*',
        '/requests/:path*',
        '/reported-items/:path*',
        '/admins/:path*'
    ],
  };
  