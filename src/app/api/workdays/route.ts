import { NextRequest, NextResponse } from 'next/server';
import { mockWorkDays } from '../../../utils/mockData';

// Use centralized mock data

// GET /api/workdays - Lấy tất cả bảng công hoặc filter
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const department = searchParams.get('department');
        const month = searchParams.get('month');
        const minDays = searchParams.get('minDays');
        const maxDays = searchParams.get('maxDays');
        const employee = searchParams.get('employee');

        let workDays = [...mockWorkDays];

        // Apply filters
        if (search) {
            const lowerSearch = search.toLowerCase();
            workDays = workDays.filter(item =>
                item.employee.toLowerCase().includes(lowerSearch) ||
                item.department.toLowerCase().includes(lowerSearch)
            );
        }

        if (employee) {
            workDays = workDays.filter(item =>
                item.employee.toLowerCase().includes(employee.toLowerCase())
            );
        }

        if (department) {
            workDays = workDays.filter(item => item.department === department);
        }

        if (month && minDays) {
            const min = parseInt(minDays);
            const max = maxDays ? parseInt(maxDays) : Infinity;

            workDays = workDays.filter(item => {
                const workDaysInMonth = item[month as keyof typeof item] as number;
                return workDaysInMonth >= min && workDaysInMonth <= max;
            });
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

// POST /api/workdays - Tạo bảng công mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['employee', 'department', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        for (const field of requiredFields) {
            if (body[field] === undefined || body[field] === null) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Check if employee already exists
        const existingWorkDays = mockWorkDays.find(item => item.employee === body.employee);
        if (existingWorkDays) {
            return NextResponse.json(
                { error: 'Bảng công cho nhân viên này đã tồn tại' },
                { status: 409 }
            );
        }

        // Create new work days record
        const newWorkDays = {
            id: Math.max(...mockWorkDays.map(item => item.id)) + 1,
            ...body
        };

        mockWorkDays.push(newWorkDays);

        return NextResponse.json(newWorkDays, { status: 201 });
    } catch (error) {
        console.error('Error creating work days:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
