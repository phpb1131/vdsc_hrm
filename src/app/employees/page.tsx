"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Employee } from "../../types/employee";
import { useEmployees } from "../../hooks/useEmployees";

export default function EmployeesPage() {
  const router = useRouter();
  const { employees, loading, error, refreshEmployees, clearError } =
    useEmployees({ autoLoad: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentDepartmentFilter, setCurrentDepartmentFilter] = useState("");

  const handleEdit = (employee: Employee) => {
    alert(`Chỉnh sửa nhân viên: ${employee.fullName}`);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (id: number) => {
    try {
      // await deleteEmployee(id);
      alert("Xóa nhân viên thành công!");
    } catch (err) {
      alert("Không thể xóa nhân viên. Vui lòng thử lại.");
    }
  };
  const handleView = (employee: Employee) => {
    router.push(`/employees/${employee.id}`);
  };
  const handleAddEmployee = () => {
    alert("Thêm nhân viên mới");
    // TODO: Implement add functionality
  };

  const handleSearch = () => {
    setCurrentSearchTerm(searchTerm);
    setCurrentDepartmentFilter(departmentFilter);
    // TODO: Gọi API với searchTerm và departmentFilter
    refreshEmployees();
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setCurrentSearchTerm("");
    setCurrentDepartmentFilter("");
    refreshEmployees();
  };

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
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((emp) => emp.department)));
  }, [employees]); // Filter employees based on current search term and department (client-side filtering)
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
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Quản lý nhân viên
        </h1>
        <Button variant="primary" onClick={handleAddEmployee}>
          <i className="bi bi-plus-circle me-2"></i>
          Thêm nhân viên
        </Button>
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
          <Button variant="outline-danger" size="sm" onClick={refreshEmployees}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Thử lại
          </Button>
        </Alert>
      )}

      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col md={6}>
              <h6 className="mb-0">
                Danh sách nhân viên ({filteredEmployees.length}/
                {employees.length})
              </h6>
            </Col>{" "}
            <Col md={6}>
              <Row className="g-2">
                <Col sm={4}>
                  <Form.Select
                    size="sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">Tất cả phòng ban</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={5}>
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
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
                </Col>{" "}
                <Col sm={3}>
                  <div className="d-flex gap-1">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSearch}
                      title="Tìm kiếm"
                    >
                      Tìm kiếm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={handleClearFilter}
                      title="Xóa bộ lọc"
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                </Col>
              </Row>
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
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleClearFilter}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="d-none d-lg-block">
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Nhân viên</th>
                        <th>Liên hệ</th>
                        <th>Phòng ban</th>
                        <th>Chức vụ</th>
                        <th>Ngày vào làm</th>
                        <th>Lương</th>
                        <th>Trạng thái</th>
                        <th style={{ width: "120px" }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  fontSize: "16px",
                                }}
                              >
                                {employee.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-bold">
                                  {employee.fullName}
                                </div>
                                <small className="text-muted">
                                  {employee.employeeCode}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="small">
                                <i className="bi bi-envelope me-1"></i>
                                <a
                                  href={`mailto:${employee.email}`}
                                  className="text-decoration-none"
                                >
                                  {employee.email}
                                </a>
                              </div>
                              <div className="small text-muted">
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
                          <td>
                            <span className="badge bg-secondary">
                              {employee.department}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {employee.position}
                            </span>
                          </td>
                          <td>{formatDate(employee.hireDate)}</td>
                          <td>
                            <span className="fw-bold text-success">
                              {formatCurrency(employee.salary)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                employee.status === "active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {employee.status === "active"
                                ? "Hoạt động"
                                : "Tạm dừng"}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleView(employee)}
                                title="Xem chi tiết"
                              >
                                <i className="bi bi-eye"></i>
                                Xem
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => handleEdit(employee)}
                                title="Chỉnh sửa"
                              >
                                <i className="bi bi-pencil"></i>
                                Sửa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Bạn có chắc chắn muốn xóa nhân viên ${employee.fullName}?`
                                    )
                                  ) {
                                    handleDelete(employee.id);
                                  }
                                }}
                                title="Xóa"
                              >
                                <i className="bi bi-trash"></i>
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="d-block d-lg-none p-3">
                <Row className="g-3">
                  {filteredEmployees.map((employee) => (
                    <Col key={employee.id} xs={12} md={6}>
                      <Card className="h-100">
                        <Card.Header className="pb-2">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  fontSize: "18px",
                                }}
                              >
                                {employee.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h6 className="mb-1">{employee.fullName}</h6>
                                <small className="text-muted">
                                  {employee.employeeCode}
                                </small>
                              </div>
                            </div>
                            <span
                              className={`badge ${
                                employee.status === "active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {employee.status === "active"
                                ? "Hoạt động"
                                : "Tạm dừng"}
                            </span>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-2 small">
                            <Col xs={12}>
                              <div className="d-flex align-items-center mb-1">
                                <i className="bi bi-envelope me-2 text-muted"></i>
                                <a
                                  href={`mailto:${employee.email}`}
                                  className="text-decoration-none"
                                >
                                  {employee.email}
                                </a>
                              </div>
                            </Col>
                            <Col xs={12}>
                              <div className="d-flex align-items-center mb-1">
                                <i className="bi bi-telephone me-2 text-muted"></i>
                                <a
                                  href={`tel:${employee.phone}`}
                                  className="text-decoration-none"
                                >
                                  {employee.phone}
                                </a>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="mb-2">
                                <small className="text-muted">Phòng ban:</small>
                                <div>
                                  <span className="badge bg-secondary small">
                                    {employee.department}
                                  </span>
                                </div>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="mb-2">
                                <small className="text-muted">Chức vụ:</small>
                                <div>
                                  <span className="badge bg-info text-dark small">
                                    {employee.position}
                                  </span>
                                </div>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <small className="text-muted">
                                Ngày vào làm:
                              </small>
                              <div>{formatDate(employee.hireDate)}</div>
                            </Col>
                            <Col xs={6}>
                              <small className="text-muted">Lương:</small>
                              <div className="fw-bold text-success">
                                {formatCurrency(employee.salary)}
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer className="text-end">
                          <div className="btn-group" role="group">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleView(employee)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Xem
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => handleEdit(employee)}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Bạn có chắc chắn muốn xóa nhân viên ${employee.fullName}?`
                                  )
                                ) {
                                  handleDelete(employee.id);
                                }
                              }}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Xóa
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
