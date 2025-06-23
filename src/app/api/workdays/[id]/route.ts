import { NextRequest, NextResponse } from 'next/server';
import { mockWorkDays } from '../../../../utils/mockData';

// Use centralized mock data

// GET /api/workdays/[id] - Lấy thông tin bảng công theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const workDaysId = parseInt(id);
        const workDays = mockWorkDays.find(item => item.id === workDaysId);

        if (!workDays) {
            return NextResponse.json(
                { error: 'Không tìm thấy bảng công' },
                { status: 404 }
            );
        }

        return NextResponse.json(workDays);
    } catch (error) {
        console.error('Error fetching work days:', error);
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
        const workDaysId = parseInt(id);
        const body = await request.json(); const workDaysIndex = mockWorkDays.findIndex(item => item.id === workDaysId);

        if (workDaysIndex === -1) {
            return NextResponse.json(
                { error: 'Không tìm thấy bảng công' },
                { status: 404 }
            );
        }

        // Update work days
        mockWorkDays[workDaysIndex] = {
            ...mockWorkDays[workDaysIndex],
            ...body,
            id: workDaysId // Ensure ID doesn't change
        };

        return NextResponse.json(mockWorkDays[workDaysIndex]);
    } catch (error) {
        console.error('Error updating work days:', error);
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
        const workDaysId = parseInt(id);
        const workDaysIndex = mockWorkDays.findIndex(item => item.id === workDaysId);

        if (workDaysIndex === -1) {
            return NextResponse.json(
                { error: 'Không tìm thấy bảng công' },
                { status: 404 }
            );
        }

        // Remove work days from array
        mockWorkDays.splice(workDaysIndex, 1);

        return NextResponse.json({ message: 'Xóa bảng công thành công' });
    } catch (error) {
        console.error('Error deleting work days:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
