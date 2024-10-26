import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";
import { AuthToken } from "./interface/jwt-payload";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    const access_token = request.cookies.get('access_token');

    // Allow access to home route without authentication
    if (pathname === '/' || pathname === '/home') {
        return NextResponse.next();
    }

    // For all other routes, require authentication
    if (!access_token || !isValidToken(access_token.value)) {
        // Redirect to home if not authenticated, with a query parameter
        const url = new URL('/home', request.url);
        url.searchParams.set('authRequired', 'true');
        return NextResponse.redirect(url);
    }

    // User is authenticated, allow access
    return NextResponse.next();
}

function isValidToken(token: string): boolean {
    try {
        const decodedToken = jwtDecode<AuthToken>(token);
        return decodedToken.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export const config = {
    matcher: ['/((?!_next/static|favicon.ico).*)'],
}
