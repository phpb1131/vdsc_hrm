import { NextRequest, NextResponse } from 'next/server';
import { mockEmployees } from '../../../utils/mockData';

// GET /api/employees - Lấy tất cả nhân viên
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        let employees = mockEmployees;

        // Tìm kiếm nếu có query
        if (query) {
            const lowerQuery = query.toLowerCase();
            employees = mockEmployees.filter(emp =>
                emp.fullName.toLowerCase().includes(lowerQuery) ||
                emp.employeeCode.toLowerCase().includes(lowerQuery) ||
                emp.email.toLowerCase().includes(lowerQuery) ||
                emp.department.toLowerCase().includes(lowerQuery)
            );
        }

        return NextResponse.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST /api/employees - Tạo nhân viên mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['employeeCode', 'fullName', 'email', 'phone', 'position', 'department', 'hireDate', 'salary'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Check if employee code already exists
        const existingEmployee = mockEmployees.find(emp => emp.employeeCode === body.employeeCode);
        if (existingEmployee) {
            return NextResponse.json(
                { error: 'Mã nhân viên đã tồn tại' },
                { status: 409 }
            );
        }

        // Create new employee
        const newEmployee = {
            id: Math.max(...mockEmployees.map(emp => emp.id)) + 1,
            ...body,
            status: 'active' as const
        };

        mockEmployees.push(newEmployee);

        return NextResponse.json(newEmployee, { status: 201 });
    } catch (error) {
        console.error('Error creating employee:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
