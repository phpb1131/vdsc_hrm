"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from "../types/employee";
import { employeeService } from "../services/employeeService";

interface UseEmployeesOptions {
  autoLoad?: boolean;
}

interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  loadEmployees: () => Promise<void>;
  createEmployee: (employee: EmployeeCreateRequest) => Promise<void>;
  updateEmployee: (
    id: number,
    employee: EmployeeUpdateRequest
  ) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  searchEmployees: (query: string) => Promise<void>;
  getEmployeeById: (id: number) => Promise<Employee | null>;
  refreshEmployees: () => Promise<void>;
  clearError: () => void;
}

export function useEmployees(
  options: UseEmployeesOptions = {}
): UseEmployeesReturn {
  // Chỉ sử dụng API thật
  const { autoLoad = true } = options;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chỉ sử dụng service thật
  const service = employeeService;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách nhân viên";
      setError(errorMessage);
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  const createEmployee = useCallback(
    async (employee: EmployeeCreateRequest) => {
      try {
        setLoading(true);
        setError(null);
        const newEmployee = await service.createEmployee(employee);
        setEmployees((prev) => [...prev, newEmployee]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể tạo nhân viên mới";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const updateEmployee = useCallback(
    async (id: number, employee: EmployeeUpdateRequest) => {
      try {
        setLoading(true);
        setError(null);
        const updatedEmployee = await service.updateEmployee(id, employee);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === id ? updatedEmployee : emp))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể cập nhật nhân viên";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const deleteEmployee = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await service.deleteEmployee(id);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể xóa nhân viên";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const searchEmployees = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setError(null);

        if (!query.trim()) {
          await loadEmployees();
          return;
        }

        const data = await service.searchEmployees(query);
        setEmployees(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể tìm kiếm nhân viên";
        setError(errorMessage);
        console.error("Error searching employees:", err);
      } finally {
        setLoading(false);
      }
    },
    [service, loadEmployees]
  );

  const getEmployeeById = useCallback(
    async (id: number): Promise<Employee | null> => {
      try {
        setError(null);
        return await service.getEmployeeById(id);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không tìm thấy nhân viên";
        setError(errorMessage);
        console.error("Error getting employee by id:", err);
        return null;
      }
    },
    [service]
  );

  const refreshEmployees = useCallback(async () => {
    await loadEmployees();
  }, [loadEmployees]);

  // Auto load employees on mount
  useEffect(() => {
    if (autoLoad) {
      loadEmployees();
    }
  }, [autoLoad, loadEmployees]);

  return {
    employees,
    loading,
    error,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    getEmployeeById,
    refreshEmployees,
    clearError,
  };
}
