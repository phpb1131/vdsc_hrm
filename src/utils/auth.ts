// Utility functions for authentication

export const AuthTokenKey = 'hrm_auth_token';

export class AuthService {
  // Lưu token vào localStorage
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AuthTokenKey, token);
    }
  }

  // Lấy token từ localStorage
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AuthTokenKey);
    }
    return null;
  }

  // Xóa token
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthTokenKey);
    }
  }

  // Kiểm tra xem user đã đăng nhập chưa
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Logout method
  static logout(): void {
    this.removeToken();
    // Redirect to login page if needed
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

// Legacy functions for backward compatibility
export function isAuthenticated(): boolean {
  return AuthService.isAuthenticated();
}

export function logout() {
  AuthService.logout();
}

// Hook để sử dụng trong React components
export function useAuth() {
  return {
    isAuthenticated: AuthService.isAuthenticated(),
    token: AuthService.getToken(),
    logout: AuthService.logout,
    setToken: AuthService.setToken,
  };
}