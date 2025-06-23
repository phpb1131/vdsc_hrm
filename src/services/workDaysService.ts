import { WorkDays, WorkDaysCreateRequest, WorkDaysUpdateRequest, WorkDaysFilterOptions } from '../types/workDays';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function để mapping dữ liệu từ API response sang WorkDays format
function mapApiResponseToWorkDays(apiItems: any[]): WorkDays[] {
    return apiItems.map((item: any, index: number) => ({
        id: item.id || index + 1,
        employee: item.hoTenKhachHang || item.fullName || item.name || `Nhân viên ${index + 1}`,
        department: item.chucVu || item.department || item.phongBan || 'Chưa xác định',
        // Tạm thời set các tháng = 0, có thể cập nhật sau khi có API chuyên cho bảng công
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

export class WorkDaysService {
    private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            // Xử lý CORS và HTTPS
            mode: 'cors',
            credentials: 'omit',
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request failed:', {
                url,
                error: error instanceof Error ? error.message : 'Unknown error',
                options: { ...defaultOptions, ...options }
            }); throw error;
        }
    } async getAllWorkDays(): Promise<WorkDays[]> {
        try {
            const response = await this.fetchApi<any>('/GetdanhSachNhanVien');

            // Log response để debug
            console.log('API Response:', response);

            // Lấy data từ response.items (theo cấu trúc API của bạn)
            const items = response.items || response.data || response || [];

            return mapApiResponseToWorkDays(items);
        } catch (error) {
            console.error('Error in getAllWorkDays:', error);
            throw error;
        }
    }

    async getWorkDaysById(id: number): Promise<WorkDays> {
        const apiData = await this.fetchApi<WorkDays>(`/workdays/${id}`);
        return mapApiResponseToWorkDays([apiData])[0];
    }

    async createWorkDays(workDays: WorkDaysCreateRequest): Promise<WorkDays> {
        const apiData = await this.fetchApi<WorkDays>('/workdays', {
            method: 'POST',
            body: JSON.stringify(workDays),
        });
        return mapApiResponseToWorkDays([apiData])[0];
    }

    async updateWorkDays(id: number, workDays: WorkDaysUpdateRequest): Promise<WorkDays> {
        const apiData = await this.fetchApi<WorkDays>(`/workdays/${id}`, {
            method: 'PUT',
            body: JSON.stringify(workDays),
        });
        return mapApiResponseToWorkDays([apiData])[0];
    }

    async deleteWorkDays(id: number): Promise<void> {
        await this.fetchApi<void>(`/workdays/${id}`, {
            method: 'DELETE',
        });
    }

    async searchWorkDays(query: string): Promise<WorkDays[]> {
        const encodedQuery = encodeURIComponent(query);
        const apiData = await this.fetchApi<WorkDays[]>(`/workdays?search=${encodedQuery}`);
        return mapApiResponseToWorkDays(apiData);
    }

    async getWorkDaysByDepartment(department: string): Promise<WorkDays[]> {
        const encodedDepartment = encodeURIComponent(department);
        const apiData = await this.fetchApi<WorkDays[]>(`/workdays?department=${encodedDepartment}`);
        return mapApiResponseToWorkDays(apiData);
    }

    async getWorkDaysByMonth(month: string, minDays?: number, maxDays?: number): Promise<WorkDays[]> {
        let url = `/workdays?month=${month}`;
        if (minDays !== undefined) url += `&minDays=${minDays}`;
        if (maxDays !== undefined) url += `&maxDays=${maxDays}`;
        const apiData = await this.fetchApi<WorkDays[]>(url);
        return mapApiResponseToWorkDays(apiData);
    }

    async filterWorkDays(filters: WorkDaysFilterOptions): Promise<WorkDays[]> {
        const params = new URLSearchParams();

        if (filters.employee) params.append('employee', filters.employee);
        if (filters.department) params.append('department', filters.department);
        if (filters.month) params.append('month', filters.month);
        if (filters.minDays !== undefined) params.append('minDays', filters.minDays.toString());
        if (filters.maxDays !== undefined) params.append('maxDays', filters.maxDays.toString());

        const apiData = await this.fetchApi<WorkDays[]>(`/workdays?${params.toString()}`);
        return mapApiResponseToWorkDays(apiData);
    }

    // Statistics methods
    async getWorkDaysStatistics(): Promise<{
        totalEmployees: number;
        averageWorkDaysPerMonth: number;
        highestWorkDaysPerYear: number;
        lowestWorkDaysPerYear: number;
        departmentStats: { department: string; totalEmployees: number; averageWorkDays: number }[];
    }> {
        return this.fetchApi<any>('/workdays/statistics');
    }
}

// Export singleton instance
export const workDaysService = new WorkDaysService();
