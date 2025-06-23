import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole, AuthenticatedRequest } from '../../../middleware/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7251/admin';

// GET /api/employees - Lấy tất cả nhân viên
export async function GET(request: NextRequest) {
    return withAuth(request, async (authenticatedRequest: AuthenticatedRequest) => {
        try {
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
                    userId: "",
                    keySearch: "",
                    currentPage: 1,
                    perPage: 100,
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
            console.error('Error fetching employees:', error);
            return NextResponse.json(
                { error: 'Internal Server Error' },
                { status: 500 }
            );
        }
    });
}

// POST /api/employees - Tạo nhân viên mới
export async function POST(request: NextRequest) {
    return withAuth(request, async (authenticatedRequest: AuthenticatedRequest) => {
        return withRole(['admin', 'hr'], authenticatedRequest, async () => {
            try {
                const body = await request.json();

                // Forward to external API
                // TODO: Implement actual create API call
                return NextResponse.json(
                    { message: 'Create endpoint - to be implemented' },
                    { status: 501 }
                );

            } catch (error) {
                console.error('Error creating employee:', error);
                return NextResponse.json(
                    { error: 'Internal Server Error' },
                    { status: 500 }
                );
            }
        });
    });
}
// export async function POST(request: NextRequest) {
//     try {
//         // Redirect to external API or return not implemented
//         return NextResponse.json(
//             { error: 'API endpoint not implemented. Use external API directly.' },
//             { status: 501 }
//         );
//     } catch (error) {
//         console.error('Error creating employee:', error);
//         return NextResponse.json(
//             { error: 'Internal Server Error' },
//             { status: 500 }
//         );
//     }
// }
