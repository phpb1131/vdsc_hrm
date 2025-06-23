import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole, AuthenticatedRequest } from '../../../../middleware/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7251/admin';

// GET /api/employees/[id] - Lấy thông tin nhân viên theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAuth(request, async (authenticatedRequest: AuthenticatedRequest) => {
        try {
            const { id } = await params;

            // Forward request to external API với authentication
            const response = await fetch(`${API_BASE_URL}/admin/AdminCustomer/QLThongTinKhachHang_TruyVanDanhSach`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': request.headers.get('Authorization') || '',
                },
                body: JSON.stringify({
                    fromDate: "2024-06-23T02:40:43.097Z",
                    toDate: "2025-06-23T02:40:43.097Z",
                    type: "Active",
                    userId: id,
                    keySearch: "",
                    currentPage: 1,
                    perPage: 1,
                    state: "",
                    profileStatus: "",
                    accountStatus: ""
                }),
            });

            if (!response.ok) {
                throw new Error(`External API error: ${response.status}`);
            }

            const data = await response.json();
            return NextResponse.json(data);

        } catch (error) {
            console.error('Error fetching employee:', error);
            return NextResponse.json(
                { error: 'Internal Server Error' },
                { status: 500 }
            );
        }
    });
}

// PUT /api/employees/[id] - Cập nhật thông tin nhân viên
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAuth(request, async (authenticatedRequest: AuthenticatedRequest) => {
        return withRole(['admin', 'hr'], authenticatedRequest, async () => {
            try {
                const { id } = await params;
                const body = await request.json();

                // Forward to external API
                // TODO: Implement actual update API call
                return NextResponse.json(
                    { message: 'Update endpoint - to be implemented' },
                    { status: 501 }
                );

            } catch (error) {
                console.error('Error updating employee:', error);
                return NextResponse.json(
                    { error: 'Internal Server Error' },
                    { status: 500 }
                );
            }
        });
    });
}

// DELETE /api/employees/[id] - Xóa nhân viên  
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAuth(request, async (authenticatedRequest: AuthenticatedRequest) => {
        return withRole(['admin'], authenticatedRequest, async () => {
            try {
                const { id } = await params;

                // Forward to external API
                // TODO: Implement actual delete API call
                return NextResponse.json(
                    { message: 'Delete endpoint - to be implemented' },
                    { status: 501 }
                );

            } catch (error) {
                console.error('Error deleting employee:', error);
                return NextResponse.json(
                    { error: 'Internal Server Error' },
                    { status: 500 }
                );
            }
        });
    });
}
