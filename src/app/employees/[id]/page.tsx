'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import { Employee } from '../../../types/employee';
import { employeeService } from '../../../services/employeeService';

export default function EmployeeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const employeeId = params.id as string;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadEmployeeDetail();
    }, [employeeId]);

    const loadEmployeeDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await employeeService.getEmployeeById(parseInt(employeeId));
            setEmployee(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        // TODO: Navigate to edit page
        alert(`Chỉnh sửa nhân viên: ${employee?.fullName}`);
    };

    const handleDelete = async () => {
        if (!employee) return;

        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ${employee.fullName}?`);
        if (!confirmed) return;

        try {
            await employeeService.deleteEmployee(employee.id);
            alert('Xóa nhân viên thành công!');
            router.push('/employees');
        } catch (err) {
            alert('Không thể xóa nhân viên. Vui lòng thử lại.');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <Container fluid className="p-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <p className="text-muted">Đang tải thông tin nhân viên...</p>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="p-4">
                <Alert variant="danger">
                    <Alert.Heading>
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Lỗi
                    </Alert.Heading>
                    <p>{error}</p>
                    <div className="d-flex gap-2">
                        <Button variant="outline-danger" onClick={loadEmployeeDetail}>
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Thử lại
                        </Button>
                        <Button variant="outline-secondary" onClick={() => router.back()}>
                            <i className="bi bi-arrow-left me-1"></i>
                            Quay lại
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    if (!employee) {
        return (
            <Container fluid className="p-4">
                <Alert variant="warning">
                    <Alert.Heading>Không tìm thấy nhân viên</Alert.Heading>
                    <p>Nhân viên với ID {employeeId} không tồn tại.</p>
                    <Button variant="outline-secondary" onClick={() => router.push('/employees')}>
                        <i className="bi bi-arrow-left me-1"></i>
                        Về danh sách nhân viên
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => router.back()}
                        className="me-3"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <div>
                        <h1 className="h3 mb-0">Chi tiết nhân viên</h1>
                        <small className="text-muted">Mã: {employee.employeeCode}</small>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="warning"
                        onClick={handleEdit}
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                    >
                        <i className="bi bi-trash me-2"></i>
                        Xóa
                    </Button>
                </div>
            </div>

            <Row className="g-4">
                {/* Personal Information */}
                <Col lg={8}>
                    <Card className="h-100">
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-person-fill me-2"></i>
                                Thông tin cá nhân
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Họ và tên</label>
                                        <div className="fw-bold fs-5">{employee.fullName}</div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Mã nhân viên</label>
                                        <div className="fw-bold">{employee.employeeCode}</div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Email</label>
                                        <div>
                                            <a href={`mailto:${employee.email}`} className="text-decoration-none">
                                                <i className="bi bi-envelope me-1"></i>
                                                {employee.email}
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Số điện thoại</label>
                                        <div>
                                            <a href={`tel:${employee.phone}`} className="text-decoration-none">
                                                <i className="bi bi-telephone me-1"></i>
                                                {employee.phone}
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Phòng ban</label>
                                        <div>
                                            <Badge bg="secondary" className="fs-6">
                                                {employee.department}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Chức vụ</label>
                                        <div>
                                            <Badge bg="info" text="dark" className="fs-6">
                                                {employee.position}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Ngày vào làm</label>
                                        <div className="fw-bold">{formatDate(employee.hireDate)}</div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Trạng thái</label>
                                        <div>
                                            <Badge
                                                bg={employee.status === 'active' ? 'success' : 'danger'}
                                                className="fs-6"
                                            >
                                                {employee.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Summary Card */}
                <Col lg={4}>
                    <Row className="g-3">
                        {/* Avatar Card */}
                        <Col xs={12}>
                            <Card className="text-center">
                                <Card.Body>
                                    <div
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                                    >
                                        {employee.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <h5 className="mb-1">{employee.fullName}</h5>
                                    <p className="text-muted mb-2">{employee.position}</p>
                                    <Badge
                                        bg={employee.status === 'active' ? 'success' : 'danger'}
                                    >
                                        {employee.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                    </Badge>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Salary Card */}
                        <Col xs={12}>
                            <Card className="bg-success text-white">
                                <Card.Body className="text-center">
                                    <i className="bi bi-currency-dollar fs-2 mb-2"></i>
                                    <h6 className="card-title">Lương hiện tại</h6>
                                    <h4 className="mb-0">{formatCurrency(employee.salary)}</h4>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Work Duration Card */}
                        <Col xs={12}>
                            <Card className="bg-info text-white">
                                <Card.Body className="text-center">
                                    <i className="bi bi-calendar-check fs-2 mb-2"></i>
                                    <h6 className="card-title">Thời gian làm việc</h6>
                                    <h5 className="mb-0">
                                        {Math.ceil((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} tháng
                                    </h5>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Additional Information */}
            <Row className="mt-4">
                <Col xs={12}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                Thông tin bổ sung
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted">
                                Nhân viên {employee.fullName} đã làm việc tại công ty từ ngày {formatDate(employee.hireDate)}.
                                Hiện tại đang giữ chức vụ {employee.position} tại phòng ban {employee.department}.
                            </p>
                            <div className="d-flex gap-2 mt-3">
                                <Button variant="outline-primary" size="sm">
                                    <i className="bi bi-file-earmark-text me-1"></i>
                                    Xem hồ sơ
                                </Button>
                                <Button variant="outline-secondary" size="sm">
                                    <i className="bi bi-clock-history me-1"></i>
                                    Lịch sử công việc
                                </Button>
                                <Button variant="outline-success" size="sm">
                                    <i className="bi bi-graph-up me-1"></i>
                                    Báo cáo hiệu suất
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
