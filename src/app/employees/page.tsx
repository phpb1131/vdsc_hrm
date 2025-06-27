"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Employee } from "../../types/employee";
import { useEmployees } from "../../hooks/useEmployees";
import ComboboxSelect from "@/components/ComboboxSelect";
import { ParamType } from "@/constants/common";
import DateTimePicker from "@/components/DateTimePicker";
import DateRangePicker from "@/components/DateRangePicker";
import CustomButton from "@/components/CustomButton";
import {
  Eye,
  Edit3,
  Plus,
  Search,
  RotateCcw,
  Download,
  RefreshCw,
  CircleX,
} from "lucide-react";

export default function EmployeesPage() {
  const router = useRouter();
  const {
    employees,
    loading,
    error,
    loadEmployees,
    refreshEmployees,
    clearError,
  } = useEmployees({ autoLoad: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentDepartmentFilter, setCurrentDepartmentFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const handleEdit = (employee: Employee) => {
    alert(`Chỉnh sửa nhân viên: ${employee.fullName}`);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (id: number) => {
    try {
      // await deleteEmployee(id);
      alert("Xóa nhân viên thành công!" + id);
    } catch (err) {
      alert("Không thể xóa nhân viên. Vui lòng thử lại." + err);
    }
  };

  const handleView = (employee: Employee) => {
    router.push(`/employees/${employee.id}`);
  };

  const handleAddEmployee = () => {
    alert("Thêm nhân viên mới");
    // TODO: Implement add functionality
  };

  const handleExportEmployees = () => {
    alert("Xuất dữ liệu nhân viên ra Excel");
    // TODO: Implement export functionality
  };

  const handleRefreshData = () => {
    refreshEmployees();
  };

  const handleProductChange = useCallback((value: string) => {
    setSelectedProduct(value);
  }, []);
  // Memoize search và clear functions
  const handleSearch = useCallback(() => {
    setCurrentSearchTerm(searchTerm);
    setCurrentDepartmentFilter(departmentFilter);
    // Truyền startDate và endDate vào loadEmployees
    loadEmployees(startDate, endDate);
  }, [searchTerm, departmentFilter, startDate, endDate, loadEmployees]);

  const handleClearFilter = useCallback(() => {
    setSearchTerm("");
    setDepartmentFilter("");
    setCurrentSearchTerm("");
    setCurrentDepartmentFilter("");
    setSelectedProduct("");
    setStartDate(null);
    setEndDate(null);
    // Load lại với date range mặc định (null, null)
    loadEmployees(null, null);
  }, [loadEmployees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get unique departments for filter
  // const departments = useMemo(() => {
  //   return Array.from(new Set(employees.map((emp) => emp.department)));
  // }, [employees]); // Filter employees based on current search term and department (client-side filtering)
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        currentSearchTerm === "" ||
        employee.fullName
          .toLowerCase()
          .includes(currentSearchTerm.toLowerCase()) ||
        employee.email
          .toLowerCase()
          .includes(currentSearchTerm.toLowerCase()) ||
        employee.employeeCode
          .toLowerCase()
          .includes(currentSearchTerm.toLowerCase());

      const matchesDepartment =
        currentDepartmentFilter === "" ||
        employee.department === currentDepartmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, currentSearchTerm, currentDepartmentFilter]);

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="text-muted">Đang tải danh sách nhân viên...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 className="h3 mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Quản lý nhân viên
        </h1>
        <div className="d-flex flex-wrap gap-2">
          <CustomButton
            variant="success"
            onClick={handleAddEmployee}
            disabled={loading}
            icon={<Plus size={18} />}
            title="Thêm nhân viên mới"
          >
            Thêm mới
          </CustomButton>
          <CustomButton
            variant="outline-success"
            onClick={handleExportEmployees}
            disabled={loading}
            icon={<Download size={16} />}
            title="Xuất dữ liệu ra Excel"
          >
            Xuất Excel
          </CustomButton>
          <CustomButton
            variant="outline-info"
            onClick={handleRefreshData}
            disabled={loading}
            loading={loading}
            icon={<RefreshCw size={16} />}
            title="Làm mới dữ liệu"
          >
            Làm mới
          </CustomButton>
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={clearError}
        >
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Lỗi
          </Alert.Heading>
          <p className="mb-2">{error}</p>
          <CustomButton
            variant="outline-danger"
            onClick={refreshEmployees}
            size="sm"
            icon={<RefreshCw size={16} />}
            title="Thử lại"
          >
            Thử lại
          </CustomButton>
        </Alert>
      )}

      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col md={2}>
              <h6 className="mb-0">
                Danh sách nhân viên ({filteredEmployees.length}/
                {employees.length})
              </h6>
            </Col>
            <Col md={10}>
              <Row className="g-2">
                <Col sm={3}>
                  <DateTimePicker
                    value={date}
                    onChange={setDate}
                    placeholder="Chọn ngày sinh"
                    size="sm"
                    showTime={false} // Hoặc bỏ qua vì mặc định là false
                  />
                </Col>
                <Col sm={3}>
                  <ComboboxSelect
                    paramType={ParamType.TINHTHANH}
                    value={selectedProduct}
                    onChange={handleProductChange}
                    placeholder="Tất cả"
                    size="sm"
                    // required
                  />
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm">
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col sm={6}>
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    size="sm"
                  />
                </Col>
                <Col sm={3}>
                  <div className="d-flex gap-2">
                    <CustomButton
                      variant="primary"
                      onClick={handleSearch}
                      disabled={loading}
                      size="sm"
                      icon={<Search size={18} />}
                      title="Tìm kiếm"
                    >
                      {"Tìm kiếm"}
                    </CustomButton>
                    <CustomButton
                      variant="outline-secondary"
                      onClick={handleClearFilter}
                      disabled={loading}
                      size="sm"
                      icon={<RotateCcw size={16} />}
                      title="Xóa bộ lọc"
                    >
                      {"Xóa bộ lọc"}
                    </CustomButton>
                  </div>
                </Col>
              </Row>
              <Row className="g-2"></Row>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-6 text-muted"></i>
              <p className="text-muted mt-2">
                {employees.length === 0
                  ? "Chưa có nhân viên nào"
                  : "Không tìm thấy nhân viên phù hợp"}
              </p>{" "}
              {(currentSearchTerm || currentDepartmentFilter) && (
                <CustomButton
                  variant="outline-primary"
                  onClick={handleClearFilter}
                  size="sm"
                  icon={<RotateCcw size={16} />}
                >
                  Xóa bộ lọc
                </CustomButton>
              )}
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{
                overflowX: "auto",
                maxWidth: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <Table
                striped
                hover
                className="mb-0"
                style={{
                  minWidth: "1400px",
                  tableLayout: "fixed",
                }}
              >
                <thead className="table">
                  <tr>
                    <th style={{ minWidth: "200px", width: "200px" }}>
                      Nhân viên
                    </th>
                    <th style={{ minWidth: "250px", width: "250px" }}>
                      Liên hệ
                    </th>
                    <th style={{ minWidth: "120px", width: "120px" }}>
                      Phòng ban
                    </th>
                    <th style={{ minWidth: "120px", width: "120px" }}>
                      Chức vụ
                    </th>
                    <th style={{ minWidth: "130px", width: "130px" }}>
                      Ngày vào làm
                    </th>
                    <th style={{ minWidth: "150px", width: "150px" }}>Lương</th>
                    <th style={{ minWidth: "120px", width: "120px" }}>
                      Trạng thái
                    </th>
                    <th style={{ minWidth: "200px", width: "200px" }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td style={{ width: "200px" }}>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              fontSize: "16px",
                              flexShrink: 0,
                            }}
                          >
                            {employee.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ overflow: "hidden" }}>
                            <div
                              className="fw-bold"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {employee.fullName}
                            </div>
                            <small
                              className="text-muted"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {employee.employeeCode}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "250px" }}>
                        <div>
                          <div
                            className="small"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <i className="bi bi-envelope me-1"></i>
                            <a
                              href={`mailto:${employee.email}`}
                              className="text-decoration-none"
                            >
                              {employee.email}
                            </a>
                          </div>
                          <div
                            className="small text-muted"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <i className="bi bi-telephone me-1"></i>
                            <a
                              href={`tel:${employee.phone}`}
                              className="text-decoration-none"
                            >
                              {employee.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "120px" }}>
                        <span
                          className="badge bg-secondary"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {employee.department}
                        </span>
                      </td>
                      <td style={{ width: "120px" }}>
                        <span
                          className="badge bg-info text-dark"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {employee.position}
                        </span>
                      </td>
                      <td style={{ width: "130px", whiteSpace: "nowrap" }}>
                        {formatDate(employee.hireDate)}
                      </td>
                      <td style={{ width: "150px" }}>
                        <span
                          className="fw-bold text-success"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {formatCurrency(employee.salary)}
                        </span>
                      </td>
                      <td style={{ width: "120px" }}>
                        <span
                          className={`badge ${
                            employee.status === "active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {employee.status === "active"
                            ? "Hoạt động"
                            : "Tạm dừng"}
                        </span>
                      </td>
                      <td style={{ width: "200px" }}>
                        <div
                          className="d-flex gap-1"
                          style={{ flexWrap: "nowrap" }}
                        >
                          <CustomButton
                            variant="info"
                            size="sm"
                            onClick={() => handleView(employee)}
                            icon={<Eye size={16} />}
                            title="Xem chi tiết"
                          >
                            Xem
                          </CustomButton>
                          <CustomButton
                            variant="warning"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                            icon={<Edit3 size={16} />}
                            title="Chỉnh sửa"
                          >
                            Sửa
                          </CustomButton>
                          <CustomButton
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(employee.id)}
                            icon={<CircleX size={16} />}
                            confirmMessage={`Bạn có chắc chắn muốn xóa nhân viên ${employee.fullName}?`}
                            confirmTitle="Xác nhận xóa"
                            title="Xóa"
                            disabled={loading}
                          >
                            Xóa
                          </CustomButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
