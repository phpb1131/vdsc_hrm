import { NextRequest, NextResponse } from 'next/server';

// GET /api/workdays/[id] - Lấy thông tin bảng công theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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

// PUT /api/workdays/[id] - Cập nhật thông tin bảng công
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Redirect to external API or return not implemented
        return NextResponse.json(
            { error: 'API endpoint not implemented. Use external API directly.' },
            { status: 501 }
        );
    } catch (error) {
        console.error('Error updating workdays:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// DELETE /api/workdays/[id] - Xóa bảng công
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Redirect to external API or return not implemented
        return NextResponse.json(
            { error: 'API endpoint not implemented. Use external API directly.' },
            { status: 501 }
        );
    } catch (error) {
        console.error('Error deleting workdays:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
