// Utility functions for authentication

export const AuthTokenKey = 'hrm_auth_token';

export class AuthService {
  // Lưu token vào localStorage và cookies
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AuthTokenKey, token);
      // Set cookie for middleware access
      document.cookie = `${AuthTokenKey}=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }
  }

  // Lấy token từ localStorage
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AuthTokenKey);
    }
    return null;
  }

  // Xóa token từ localStorage và cookies
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthTokenKey);
      // Remove cookie
      document.cookie = `${AuthTokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }

  // Kiểm tra xem user đã đăng nhập chưa
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }    // Logout method
  static logout(): void {
    this.removeToken();
    // Remove cookies
    if (typeof window !== 'undefined') {
      document.cookie = 'hrm_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('userInfo');

      // Redirect to login page
      window.location.href = '/login';
    }
  }

  // Get user info
  static getUserInfo(): any {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }

  // Set user info
  static setUserInfo(userInfo: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
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
    userInfo: AuthService.getUserInfo(),
    logout: AuthService.logout,
    setToken: AuthService.setToken,
    setUserInfo: AuthService.setUserInfo,
  };
}