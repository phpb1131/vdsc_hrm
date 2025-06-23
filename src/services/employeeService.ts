import {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from "../types/employee";
import { AuthService } from "../utils/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7251/admin";

// Helper function để mapping dữ liệu từ API response sang Employee format
function mapApiResponseToEmployees(apiItems: any[]): Employee[] {
  return apiItems.map((item: any, index: number) => ({
    id: item.id || index + 1,
    employeeCode:
      item.maKhachHang ||
      item.maTaiKhoanGiaoDich ||
      `EMP${(index + 1).toString().padStart(3, "0")}`,
    fullName:
      item.hoTenKhachHang ||
      item.fullName ||
      item.name ||
      `Nhân viên ${index + 1}`,
    email: item.email || `employee${index + 1}@company.com`,
    phone:
      item.soDiDong || item.soDienThoaiLienHe || item.phone || "0000000000",
    position: item.chucVu || item.position || "Nhân viên",
    department: item.ngheNghiep || item.department || "Chưa xác định",
    hireDate: item.createdTime
      ? new Date(item.createdTime).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    salary: item.salary || 0,
    status: item.state === "A" && item.objStatus === 30 ? "active" : "inactive",
  }));
}

export class EmployeeService {
  /**
   * Gọi API với bảo mật tự động qua AuthService
   */
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // 🔐 Sử dụng AuthService tập trung để lấy token
    const token = AuthService.getBearerToken();

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
      credentials: "omit",
      ...options,
    };

    try {
      console.log("🔐 Employee API Call:", {
        endpoint,
        method: options?.method || "GET",
      });

      const response = await fetch(url, defaultOptions);

      // Xử lý lỗi authentication - AuthService sẽ handle logout
      if (response.status === 401) {
        console.warn("Token expired. Logging out...");
        AuthService.logout();
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi API: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Employee API Success:", endpoint);
      return data;
    } catch (error) {
      console.error("❌ Employee API Error:", error);
      throw error;
    }
  }
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const requestBody = {
        fromDate: "2024-06-23T02:40:43.097Z",
        toDate: "2025-06-23T02:40:43.097Z",
        type: "Active",
        userId: "",
        keySearch: "",
        currentPage: 1,
        perPage: 100, // Lấy nhiều hơn để hiển thị đầy đủ
        state: "",
        profileStatus: "",
        accountStatus: "",
      };

      const response = await this.fetchApi<any>(
        "/admin/AdminCustomer/QLThongTinKhachHang_TruyVanDanhSach",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Log response để debug
      console.log("Employee API Response:", response);

      // Lấy data từ response.items (theo cấu trúc API của bạn)
      const items = response.items || response.data || response || [];

      return mapApiResponseToEmployees(items);
    } catch (error) {
      console.error("Error in getAllEmployees:", error);
      throw error;
    }
  }
  async getEmployeeById(id: number): Promise<Employee> {
    try {
      // Sử dụng cùng endpoint nhưng filter theo ID cụ thể
      const requestBody = {
        fromDate: "2024-06-23T02:40:43.097Z",
        toDate: "2025-06-23T02:40:43.097Z",
        type: "Active",
        userId: id.toString(), // Sử dụng userId để filter theo ID
        keySearch: "",
        currentPage: 1,
        perPage: 1,
        state: "",
        profileStatus: "",
        accountStatus: "",
      };

      const response = await this.fetchApi<any>(
        "/admin/AdminCustomer/QLThongTinKhachHang_TruyVanDanhSach",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Employee by ID API Response:", response);

      const items = response.items || response.data || response || [];
      const mappedEmployees = mapApiResponseToEmployees(items);

      // Nếu không tìm thấy với userId, thử tìm trong tất cả employees
      if (mappedEmployees.length === 0) {
        const allRequestBody = {
          fromDate: "2024-06-23T02:40:43.097Z",
          toDate: "2025-06-23T02:40:43.097Z",
          type: "Active",
          userId: "",
          keySearch: "",
          currentPage: 1,
          perPage: 100,
          state: "",
          profileStatus: "",
          accountStatus: "",
        };

        const allResponse = await this.fetchApi<any>(
          "/admin/AdminCustomer/QLThongTinKhachHang_TruyVanDanhSach",
          {
            method: "POST",
            body: JSON.stringify(allRequestBody),
          }
        );

        const allItems =
          allResponse.items || allResponse.data || allResponse || [];
        const allMappedEmployees = mapApiResponseToEmployees(allItems);

        // Tìm employee theo ID đã mapping
        const foundEmployee = allMappedEmployees.find((emp) => emp.id === id);
        if (!foundEmployee) {
          throw new Error("Employee not found");
        }
        return foundEmployee;
      }

      return mappedEmployees[0];
    } catch (error) {
      console.error("Error in getEmployeeById:", error);
      throw error;
    }
  }

  async createEmployee(employee: EmployeeCreateRequest): Promise<Employee> {
    return this.fetchApi<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(
    id: number,
    employee: EmployeeUpdateRequest
  ): Promise<Employee> {
    return this.fetchApi<Employee>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.fetchApi<void>(`/employees/${id}`, {
      method: "DELETE",
    });
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    try {
      const requestBody = {
        fromDate: "2024-06-23T02:40:43.097Z",
        toDate: "2025-06-23T02:40:43.097Z",
        type: "Active",
        userId: "",
        keySearch: query,
        currentPage: 1,
        perPage: 100,
        state: "",
        profileStatus: "",
        accountStatus: "",
      };

      const response = await this.fetchApi<any>(
        "/QLThongTinKhachHang_TruyVanDanhSach",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      const items = response.items || response.data || response || [];
      return mapApiResponseToEmployees(items);
    } catch (error) {
      console.error("Error in searchEmployees:", error);
      throw error;
    }
  }

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    try {
      const requestBody = {
        fromDate: "2024-06-23T02:40:43.097Z",
        toDate: "2025-06-23T02:40:43.097Z",
        type: "Active",
        userId: "",
        keySearch: department,
        currentPage: 1,
        perPage: 100,
        state: "",
        profileStatus: "",
        accountStatus: "",
      };

      const response = await this.fetchApi<any>(
        "/QLThongTinKhachHang_TruyVanDanhSach",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      const items = response.items || response.data || response || [];
      return mapApiResponseToEmployees(items);
    } catch (error) {
      console.error("Error in getEmployeesByDepartment:", error);
      throw error;
    }
  }

  async getEmployeesByStatus(
    status: "active" | "inactive"
  ): Promise<Employee[]> {
    try {
      const requestBody = {
        fromDate: "2024-06-23T02:40:43.097Z",
        toDate: "2025-06-23T02:40:43.097Z",
        type: status === "active" ? "Active" : "Inactive",
        userId: "",
        keySearch: "",
        currentPage: 1,
        perPage: 100,
        state: "",
        profileStatus: "",
        accountStatus: "",
      };

      const response = await this.fetchApi<any>(
        "/QLThongTinKhachHang_TruyVanDanhSach",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      const items = response.items || response.data || response || [];
      return mapApiResponseToEmployees(items);
    } catch (error) {
      console.error("Error in getEmployeesByStatus:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();
