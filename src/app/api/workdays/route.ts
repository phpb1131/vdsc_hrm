import { NextRequest, NextResponse } from 'next/server';

// GET /api/workdays - Lấy tất cả bảng công hoặc filter
export async function GET(request: NextRequest) {
    try {
        // Redirect to external API or return not implemented
        return NextResponse.json(
            { error: 'API endpoint not implemented. Use external API directly.' },
            { status: 501 }
        );
    } catch (error) {
        console.error('Error fetching workdays:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST /api/workdays - Tạo bảng công mới
export async function POST(request: NextRequest) {
    try {
        // Redirect to external API or return not implemented
        return NextResponse.json(
            { error: 'API endpoint not implemented. Use external API directly.' },
            { status: 501 }
        );
    } catch (error) {
        console.error('Error creating workdays:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
