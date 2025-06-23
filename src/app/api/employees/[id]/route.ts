import { NextRequest, NextResponse } from 'next/server';
import { mockEmployees } from '../../../../utils/mockData';

// GET /api/employees/[id] - Lấy thông tin nhân viên theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);
        const employee = mockEmployees.find(emp => emp.id === employeeId);

        if (!employee) {
            return NextResponse.json(
                { error: 'Không tìm thấy nhân viên' },
                { status: 404 }
            );
        }

        return NextResponse.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// PUT /api/employees/[id] - Cập nhật thông tin nhân viên
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);
        const body = await request.json();

        const employeeIndex = mockEmployees.findIndex(emp => emp.id === employeeId);

        if (employeeIndex === -1) {
            return NextResponse.json(
                { error: 'Không tìm thấy nhân viên' },
                { status: 404 }
            );
        }

        // Update employee
        mockEmployees[employeeIndex] = {
            ...mockEmployees[employeeIndex],
            ...body,
            id: employeeId // Ensure ID doesn't change
        };

        return NextResponse.json(mockEmployees[employeeIndex]);
    } catch (error) {
        console.error('Error updating employee:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// DELETE /api/employees/[id] - Xóa nhân viên
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);
        const employeeIndex = mockEmployees.findIndex(emp => emp.id === employeeId);

        if (employeeIndex === -1) {
            return NextResponse.json(
                { error: 'Không tìm thấy nhân viên' },
                { status: 404 }
            );
        }

        // Remove employee from array
        mockEmployees.splice(employeeIndex, 1);

        return NextResponse.json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
