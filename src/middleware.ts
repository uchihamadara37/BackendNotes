import { NextRequest, NextResponse } from 'next/server';
console.log("jangkrik middleware2");

export function middleware(req: NextRequest) {
    console.log("jangkrik middleware 5000");
    console.log("Middleware executed:", req.nextUrl.pathname);

    // cors
    const response = NextResponse.next();
    const allowedOrigins = [
        'https://8080-cs-a6858464-1a31-44a9-b787-295e6771a781.cs-asia-southeast1-yelo.cloudshell.dev',
        'https://3000-cs-a6858464-1a31-44a9-b787-295e6771a781.cs-asia-southeast1-yelo.cloudshell.dev',
        "http://localhost:3000",
        "http://localhost:8080",
        'https://c-01-450604.uc.r.appspot.com',
        'https://andre-next-frontend-dot-c-01-450604.uc.r.appspot.com'
    ];

    const origin = req.headers.get('origin');
    if (origin && allowedOrigins.includes(origin)) {
        console.log("lewat origin")
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        console.log("lewat options")
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    }
    return response;


    // firebase
    const token = req.cookies.get('firebase-auth-token'); // Sesuaikan dengan cara menyimpan token

    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*'], // Tentukan halaman yang perlu login
};
