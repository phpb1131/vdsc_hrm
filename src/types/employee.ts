export interface Employee {
    id: number;
    employeeCode: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    hireDate: string;
    salary: number;
    status: 'active' | 'inactive';
    avatar?: string;
}

export interface EmployeeCreateRequest {
    employeeCode: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    hireDate: string;
    salary: number;
}

export interface EmployeeUpdateRequest extends Partial<EmployeeCreateRequest> {
    id: number;
    status?: 'active' | 'inactive';
}
