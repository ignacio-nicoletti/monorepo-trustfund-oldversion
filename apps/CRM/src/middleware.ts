export { default } from "next-auth/middleware"
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set headers for matched routes
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Apply middleware only to specific routes
export const config = {
  matcher: [
    '/api/:path*',       // Apply to all API routes
    '/dashboard/:path*', // Apply to routes under /dashboard
    '/uploadFile/:path*' // Apply to routes under /uploadFile (if needed)
  ],
};

