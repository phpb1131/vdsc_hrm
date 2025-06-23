import { ROUTES } from '@/constants/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    // Những path cần login (private routes)
    const PRIVATE_PATHS: string[] = [
        ROUTES.EMPLOYEES,
        ROUTES.EMPLOYEE_DETAIL,
        ROUTES.WORKDAYS,
        ROUTES.LEAVES,
        ROUTES.SALARY,
        ROUTES.API_TEST,
    ];

    // Những path khi đã login rồi thì không vào được nữa (auth pages)
    const AUTH_PATHS: string[] = [ROUTES.LOGIN];

    // Lấy token từ cookies hoặc localStorage (trong browser)
    const token = request.cookies.get('hrm_auth_token')?.value;

    // Check if path matches dynamic routes like /employees/[id]
    const isPrivateDynamicRoute = PRIVATE_PATHS.some((route) => {
        const regex = new RegExp(`^${route.replace(/\[.*?\]/g, '[^/]+').replace(/:[^/]+/g, '[^/]+')}$`);
        return regex.test(path);
    });

    // Nếu không có token và đang truy cập private route → redirect to login
    if (!token && (PRIVATE_PATHS.includes(path) || isPrivateDynamicRoute)) {
        const loginUrl = new URL(ROUTES.LOGIN, request.url);
        loginUrl.searchParams.set('returnUrl', path); // Save return URL
        return NextResponse.redirect(loginUrl);
    }

    // Nếu đã có token và đang truy cập auth pages → redirect to employees
    if (token && AUTH_PATHS.includes(path)) {
        return NextResponse.redirect(new URL(ROUTES.EMPLOYEES, request.url));
    }

    // Redirect root path to employees if authenticated, login if not
    if (path === ROUTES.HOME) {
        if (token) {
            return NextResponse.redirect(new URL(ROUTES.EMPLOYEES, request.url));
        } else {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
        }
    }

    return NextResponse.next();
}

// Những path cần đi qua middleware
export const config = {
    matcher: [
        '/',
        '/login',
        '/employees/:path*',
        '/workdays/:path*',
        '/leaves/:path*',
        '/salary/:path*',
        '/api-test/:path*',
    ],
};
