"use client";

import React, { useState, useMemo } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useWorkDays } from "../../hooks/useWorkDays";

function WorkDaysPage() {
  // Use the custom hook - sử dụng API thật
  const { workDays, loading, error, statistics, loadWorkDays, clearError } =
    useWorkDays({ autoLoad: true });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [minWorkDays, setMinWorkDays] = useState("");
  const [maxWorkDays, setMaxWorkDays] = useState("");

  // Get unique departments
  const departments = useMemo(() => {
    return [...new Set(workDays.map((item) => item.department))];
  }, []);

  // Month mapping
  const months = [
    { key: "january", label: "Tháng 1" },
    { key: "february", label: "Tháng 2" },
    { key: "march", label: "Tháng 3" },
    { key: "april", label: "Tháng 4" },
    { key: "may", label: "Tháng 5" },
    { key: "june", label: "Tháng 6" },
    { key: "july", label: "Tháng 7" },
    { key: "august", label: "Tháng 8" },
    { key: "september", label: "Tháng 9" },
    { key: "october", label: "Tháng 10" },
    { key: "november", label: "Tháng 11" },
    { key: "december", label: "Tháng 12" },
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return workDays.filter((item) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        item.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase());

      // Department filter
      const matchesDepartment =
        selectedDepartment === "" || item.department === selectedDepartment;

      // Month filter (if selected, filter by work days in that month)
      let matchesMonth = true;
      if (selectedMonth && minWorkDays) {
        const workDaysInMonth = item[
          selectedMonth as keyof typeof item
        ] as number;
        const minDays = parseInt(minWorkDays);
        const maxDays = maxWorkDays ? parseInt(maxWorkDays) : Infinity;
        matchesMonth = workDaysInMonth >= minDays && workDaysInMonth <= maxDays;
      }

      return matchesSearch && matchesDepartment && matchesMonth;
    });
  }, [
    workDays,
    searchTerm,
    selectedDepartment,
    selectedMonth,
    minWorkDays,
    maxWorkDays,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedMonth("");
    setMinWorkDays("");
    setMaxWorkDays("");
  };
  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="bi bi-calendar-check me-2"></i>
          Bảng công nhân viên
        </h1>
        <Button
          variant="outline-primary"
          onClick={loadWorkDays}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => {
              clearError();
              loadWorkDays();
            }}
          >
            Thử lại
          </button>
          <button className="btn-close ms-2" onClick={clearError}></button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải dữ liệu bảng công...</p>
        </div>
      )}

      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="bi bi-funnel me-2"></i>
              Bộ lọc
            </h6>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearFilters}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Xóa bộ lọc
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {/* Search */}
            <Col md={6} lg={3}>
              <Form.Label>Tìm kiếm</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tên nhân viên, phòng ban..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* Department Filter */}
            <Col md={6} lg={2}>
              <Form.Label>Phòng ban</Form.Label>
              <Form.Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Tất cả</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Month Filter */}
            <Col md={6} lg={2}>
              <Form.Label>Lọc theo tháng</Form.Label>
              <Form.Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Chọn tháng</option>
                {months.map((month) => (
                  <option key={month.key} value={month.key}>
                    {month.label}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Min Work Days */}
            <Col md={3} lg={2}>
              <Form.Label>Số ngày tối thiểu</Form.Label>
              <Form.Control
                type="number"
                placeholder="VD: 20"
                value={minWorkDays}
                onChange={(e) => setMinWorkDays(e.target.value)}
                disabled={!selectedMonth}
              />
            </Col>

            {/* Max Work Days */}
            <Col md={3} lg={2}>
              <Form.Label>Số ngày tối đa</Form.Label>
              <Form.Control
                type="number"
                placeholder="VD: 25"
                value={maxWorkDays}
                onChange={(e) => setMaxWorkDays(e.target.value)}
                disabled={!selectedMonth}
              />
            </Col>

            {/* Results Info */}
            <Col lg={1}>
              <Form.Label>&nbsp;</Form.Label>
              <div className="d-flex align-items-center h-100">
                <span className="badge bg-info">
                  {filteredData.length}/{workDays.length}
                </span>
              </div>
            </Col>
          </Row>

          {/* Active Filters Display */}
          {(searchTerm ||
            selectedDepartment ||
            selectedMonth ||
            minWorkDays) && (
            <div className="mt-3 pt-3 border-top">
              <small className="text-muted me-2">Bộ lọc đang áp dụng:</small>
              {searchTerm && (
                <span className="badge bg-primary me-2">
                  Tìm kiếm: "{searchTerm}"
                  <button
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: "0.7em" }}
                    onClick={() => setSearchTerm("")}
                  ></button>
                </span>
              )}
              {selectedDepartment && (
                <span className="badge bg-success me-2">
                  Phòng ban: {selectedDepartment}
                  <button
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: "0.7em" }}
                    onClick={() => setSelectedDepartment("")}
                  ></button>
                </span>
              )}
              {selectedMonth && (
                <span className="badge bg-warning text-dark me-2">
                  {months.find((m) => m.key === selectedMonth)?.label}
                  {minWorkDays && ` (≥${minWorkDays})`}
                  {maxWorkDays && ` (≤${maxWorkDays})`}
                  <button
                    className="btn-close ms-1"
                    style={{ fontSize: "0.7em" }}
                    onClick={() => {
                      setSelectedMonth("");
                      setMinWorkDays("");
                      setMaxWorkDays("");
                    }}
                  ></button>
                </span>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <div
            className="table-responsive"
            style={{
              maxHeight: "70vh",
              overflowX: "auto",
              overflowY: "auto",
              border: "1px solid #dee2e6",
              borderRadius: "0.375rem",
            }}
          >
            <Table striped bordered hover className="mb-0">
              <thead className="table-dark sticky-top">
                <tr>
                  <th
                    style={{
                      minWidth: "60px",
                      position: "sticky",
                      left: 0,
                      zIndex: 10,
                      backgroundColor: "#212529",
                      borderRight: "2px solid #495057",
                    }}
                  >
                    STT
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    {" "}
                    Nhân viên
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Phòng ban
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 1
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 2
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 3
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 4
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 5
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 6
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 7
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 8
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 9
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 10
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 11
                  </th>
                  <th style={{ minWidth: "80px", textAlign: "center" }}>
                    Tháng 12
                  </th>
                  <th
                    style={{
                      minWidth: "100px",
                      textAlign: "center",
                      backgroundColor: "#0d6efd",
                      color: "white",
                    }}
                  >
                    Tổng cộng{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 5,
                        backgroundColor: "white",
                        borderRight: "2px solid #dee2e6",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.january >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.employee}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.january >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.department}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.january >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.january}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.february >= 20 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.february}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.march >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.march}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.april >= 21 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.april}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.may >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.may}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.june >= 21 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.june}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.july >= 23 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.july}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.august >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.august}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.september >= 21 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.september}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.october >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.october}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.november >= 21 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.november}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: item.december >= 22 ? "#198754" : "#dc3545",
                      }}
                    >
                      {item.december}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        backgroundColor: "#e3f2fd",
                        color: "#0d6efd",
                        fontSize: "16px",
                      }}
                    >
                      {item.january +
                        item.february +
                        item.march +
                        item.april +
                        item.may +
                        item.june +
                        item.july +
                        item.august +
                        item.september +
                        item.october +
                        item.november +
                        item.december}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* No data message */}
          {filteredData.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-6 text-muted"></i>
              <p className="text-muted mt-2">
                {workDays.length === 0
                  ? "Không có dữ liệu bảng công"
                  : "Không tìm thấy dữ liệu phù hợp với bộ lọc"}
              </p>
              {searchTerm || selectedDepartment || selectedMonth ? (
                <Button variant="outline-primary" onClick={clearFilters}>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Xóa bộ lọc
                </Button>
              ) : null}
            </div>
          )}{" "}
          {/* Summary Statistics */}
          {filteredData.length > 0 && (
            <div className="row mt-4 g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h6 className="card-title">Tổng nhân viên</h6>
                    <h3 className="mb-0">{statistics.totalEmployees}</h3>
                    {filteredData.length !== workDays.length && (
                      <small>/ {workDays.length} tổng</small>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h6 className="card-title">TB công/tháng</h6>
                    <h3 className="mb-0">
                      {statistics.averageWorkDaysPerMonth}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h6 className="card-title">Cao nhất/năm</h6>
                    <h3 className="mb-0">
                      {statistics.highestWorkDaysPerYear}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h6 className="card-title">Thấp nhất/năm</h6>
                    <h3 className="mb-0">{statistics.lowestWorkDaysPerYear}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default WorkDaysPage;
