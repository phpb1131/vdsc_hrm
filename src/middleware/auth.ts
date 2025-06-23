import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../utils/auth';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export async function withAuth(
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        // Lấy token từ Authorization header
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid Authorization header' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        // Validate token (có thể gọi API để verify token)
        const isValidToken = await validateToken(token);

        if (!isValidToken) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Lấy thông tin user từ token
        const user = await getUserFromToken(token);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 401 }
            );
        }

        // Attach user info to request
        const authenticatedRequest = request as AuthenticatedRequest;
        authenticatedRequest.user = user;

        // Proceed with the original handler
        return await handler(authenticatedRequest);

    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

async function validateToken(token: string): Promise<boolean> {
    try {
        // TODO: Implement actual token validation
        // Có thể gọi API backend để verify token
        // For now, just check if token exists and has reasonable length
        return !!(token && token.length > 10);
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

async function getUserFromToken(token: string): Promise<{ id: string; email: string; role: string } | null> {
    try {
        // TODO: Decode token or call API to get user info
        // For now, return a mock user

        return {
            id: '1',
            email: 'user@company.com',
            role: 'admin'
        };
    } catch (error) {
        console.error('Get user from token error:', error);
        return null;
    }
}

// Role-based authorization middleware
export async function withRole(
    allowedRoles: string[],
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        if (!request.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        if (!allowedRoles.includes(request.user.role)) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return await handler(request);
    } catch (error) {
        console.error('Authorization error:', error);
        return NextResponse.json(
            { error: 'Authorization failed' },
            { status: 500 }
        );
    }
}
