import { WorkDays, WorkDaysCreateRequest, WorkDaysUpdateRequest, WorkDaysFilterOptions } from '../types/workDays';
import { AuthService } from '../utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7251/admin';

// Helper function để mapping dữ liệu từ API response sang WorkDays format
function mapApiResponseToWorkDays(apiItems: any[]): WorkDays[] {
    if (!Array.isArray(apiItems)) return [];

    return apiItems.map((item: any, index: number) => ({
        id: item.id || index + 1,
        employee: item.hoTenKhachHang || item.fullName || item.name || `Nhân viên ${index + 1}`,
        department: item.chucVu || item.department || item.phongBan || 'Chưa xác định',
        january: item.thang1 || item.january || 0,
        february: item.thang2 || item.february || 0,
        march: item.thang3 || item.march || 0,
        april: item.thang4 || item.april || 0,
        may: item.thang5 || item.may || 0,
        june: item.thang6 || item.june || 0,
        july: item.thang7 || item.july || 0,
        august: item.thang8 || item.august || 0,
        september: item.thang9 || item.september || 0,
        october: item.thang10 || item.october || 0,
        november: item.thang11 || item.november || 0,
        december: item.thang12 || item.december || 0,
    }));
}

/**
 * WorkDays Service - Xử lý tất cả nghiệp vụ liên quan đến bảng công
 * 
 * Luồng hoạt động: UI -> WorkDaysService -> External API (có bảo mật)
 */
export class WorkDaysService {
    /**
     * Kiểm tra authentication trước mỗi API call
     */
    private checkAuthentication(): void {
        if (!AuthService.isAuthenticated()) {
            console.warn('User not authenticated. Redirecting to login...');
            AuthService.logout();
            throw new Error('Vui lòng đăng nhập để tiếp tục');
        }
    }

    /**
     * Lấy token với kiểm tra bảo mật
     */
    private getBearerToken(): string {
        this.checkAuthentication();

        let token = AuthService.getToken();

        if (!token && typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
            if (tokenCookie) {
                token = tokenCookie.split('=')[1];
            }
        }

        if (!token) {
            AuthService.logout();
            throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại');
        }

        return token;
    }

    /**
     * Gọi API với bảo mật tự động
     */
    private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getBearerToken();

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            mode: 'cors',
            credentials: 'omit',
            ...options,
        };

        try {
            console.log('🔐 WorkDays API Call:', { endpoint, method: options?.method || 'GET' });

            const response = await fetch(url, defaultOptions);

            // Xử lý lỗi authentication
            if (response.status === 401) {
                console.warn('Token expired. Logging out...');
                AuthService.logout();
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Lỗi API: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ WorkDays API Success:', endpoint);
            return data;

        } catch (error) {
            console.error('❌ WorkDays API Error:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách bảng công
     */
    async getAllWorkDays(): Promise<WorkDays[]> {
        try {
            const requestBody = {
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                currentPage: 1,
                perPage: 100
            };

            const response = await this.fetchApi<any>('/admin/AdminWorkday/GetListWorkday', {
                method: 'POST',
                body: JSON.stringify(requestBody),
            });

            const items = response.items || response.data || response || [];
            return mapApiResponseToWorkDays(items);
        } catch (error) {
            console.error('Error in getAllWorkDays:', error);
            throw new Error('Không thể lấy danh sách bảng công');
        }
    }

    /**
     * Lấy bảng công theo ID
     */
    async getWorkDaysById(id: number): Promise<WorkDays> {
        try {
            const allWorkDays = await this.getAllWorkDays();
            const workDay = allWorkDays.find(item => item.id === id);

            if (!workDay) {
                throw new Error('Không tìm thấy bảng công');
            }

            return workDay;
        } catch (error) {
            console.error('Error in getWorkDaysById:', error);
            throw new Error('Không thể lấy thông tin bảng công');
        }
    }

    /**
     * Tạo bảng công mới
     */
    async createWorkDays(workDays: WorkDaysCreateRequest): Promise<WorkDays> {
        try {
            const response = await this.fetchApi<any>('/admin/AdminWorkday/CreateWorkday', {
                method: 'POST',
                body: JSON.stringify(workDays),
            });

            const mapped = mapApiResponseToWorkDays([response]);
            return mapped[0];
        } catch (error) {
            console.error('Error in createWorkDays:', error);
            throw new Error('Không thể tạo bảng công mới');
        }
    }

    /**
     * Cập nhật bảng công
     */
    async updateWorkDays(id: number, workDays: WorkDaysUpdateRequest): Promise<WorkDays> {
        try {
            const response = await this.fetchApi<any>(`/admin/AdminWorkday/UpdateWorkday/${id}`, {
                method: 'PUT',
                body: JSON.stringify(workDays),
            });

            const mapped = mapApiResponseToWorkDays([response]);
            return mapped[0];
        } catch (error) {
            console.error('Error in updateWorkDays:', error);
            throw new Error('Không thể cập nhật bảng công');
        }
    }

    /**
     * Xóa bảng công
     */
    async deleteWorkDays(id: number): Promise<void> {
        try {
            await this.fetchApi<void>(`/admin/AdminWorkday/DeleteWorkday/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error in deleteWorkDays:', error);
            throw new Error('Không thể xóa bảng công');
        }
    }

    /**
     * Lấy bảng công theo tháng/năm
     */
    async getWorkDaysByMonth(month: number, year: number): Promise<WorkDays[]> {
        try {
            const requestBody = {
                month,
                year,
                currentPage: 1,
                perPage: 100
            };

            const response = await this.fetchApi<any>('/admin/AdminWorkday/GetListWorkday', {
                method: 'POST',
                body: JSON.stringify(requestBody),
            });

            const items = response.items || response.data || response || [];
            return mapApiResponseToWorkDays(items);
        } catch (error) {
            console.error('Error in getWorkDaysByMonth:', error);
            throw new Error('Không thể lấy bảng công theo tháng');
        }
    }

    /**
     * Lấy bảng công theo nhân viên
     */
    async getWorkDaysByEmployee(employeeId: string): Promise<WorkDays[]> {
        try {
            const requestBody = {
                employeeId,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                currentPage: 1,
                perPage: 100
            };

            const response = await this.fetchApi<any>('/admin/AdminWorkday/GetListWorkday', {
                method: 'POST',
                body: JSON.stringify(requestBody),
            });

            const items = response.items || response.data || response || [];
            return mapApiResponseToWorkDays(items);
        } catch (error) {
            console.error('Error in getWorkDaysByEmployee:', error);
            throw new Error('Không thể lấy bảng công theo nhân viên');
        }
    }
}

// Export singleton instance
export const workDaysService = new WorkDaysService();
