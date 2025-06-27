"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { AuthService } from "../../utils/auth";

// Component con chứa logic sử dụng useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call login API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/AdminUser/LoginGenerateAuthentication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loginType: 1,
            userName: formData.username,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success && data.entity?.token) {
        // Save token to cookies and localStorage
        const token = data.entity.token;
        const refreshToken = data.entity.tokenRefresh;
        // Save to localStorage for client-side access
        AuthService.setToken(token); // Save to cookies for compatibility and potential SSR needs
        document.cookie = `hrm_auth_token=${token}; path=/; max-age=3600; SameSite=strict`;
        document.cookie = `accessToken=${token}; path=/; max-age=3600; SameSite=strict`;
        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=86400; SameSite=strict`;
        }

        // Save user info
        const userInfo = {
          userId: data.entity.userId,
          email: data.entity.email,
          fullName: data.entity.fullName,
          id: data.entity.id,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log("Login successful:", data);

        // Redirect to return URL or employees page (default)
        const redirectUrl = returnUrl || "/employees";
        router.push(redirectUrl);
      } else {
        // Handle login failure
        setError(data.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <Card className="shadow">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">HRM System</h2>
              <p className="text-muted">Đăng nhập vào hệ thống</p>
            </div>
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Form>{" "}
            <div className="text-center">
              <small className="text-muted">
                Nhập thông tin đăng nhập của bạn
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

// Loading component cho Suspense fallback
function LoginLoading() {
  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <Card className="shadow">
          <Card.Body className="p-5 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="text-muted">Đang tải trang đăng nhập...</p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

// Component chính với Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
