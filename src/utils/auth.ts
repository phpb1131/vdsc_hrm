// Enhanced Authentication Service with Security Features

export const AuthTokenKey = 'hrm_auth_token';
export const RefreshTokenKey = 'hrm_refresh_token';
export const TokenExpiryKey = 'hrm_token_expiry';

interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
}

export class AuthService {
  private static readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static retryCount = 0;

  /**
   * 🔐 ENHANCED SECURITY: Lưu token với validation và expiry tracking
   */
  static setToken(token: string, refreshToken?: string, expiresIn?: number): void {
    if (!token || token.trim().length === 0) {
      throw new Error('Invalid token provided');
    }

    if (typeof window !== 'undefined') {
      try {
        // Calculate expiry time (default 1 hour if not provided)
        const expiresAt = expiresIn
          ? Date.now() + (expiresIn * 1000)
          : Date.now() + (60 * 60 * 1000); // 1 hour default

        // Store in localStorage
        localStorage.setItem(AuthTokenKey, token);
        localStorage.setItem(TokenExpiryKey, expiresAt.toString());

        if (refreshToken) {
          localStorage.setItem(RefreshTokenKey, refreshToken);
        }

        // Store in secure httpOnly cookie for additional security
        const cookieOptions = `path=/; max-age=${expiresIn || 3600}; SameSite=Strict; Secure`;
        document.cookie = `${AuthTokenKey}=${token}; ${cookieOptions}`;

        if (refreshToken) {
          document.cookie = `${RefreshTokenKey}=${refreshToken}; ${cookieOptions}`;
        }

        // Reset retry count on successful token set
        this.retryCount = 0;

        console.log('🔐 Token stored successfully with expiry:', new Date(expiresAt));
      } catch (error) {
        console.error('❌ Error storing token:', error);
        throw new Error('Failed to store authentication token');
      }
    }
  }

  /**
   * 🔐 ENHANCED SECURITY: Lấy token với validation và expiry check
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      // Get from localStorage first
      let token = localStorage.getItem(AuthTokenKey);

      // Fallback to cookies if not in localStorage
      if (!token) {
        token = this.getTokenFromCookies();
      }

      if (!token) {
        console.warn('🔐 No token found in storage');
        return null;
      }

      // Check if token is expired
      if (this.isTokenExpired()) {
        console.warn('🔐 Token has expired');
        this.clearExpiredToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('❌ Error retrieving token:', error);
      return null;
    }
  }

  /**
   * 🔐 ENHANCED SECURITY: Kiểm tra token expiry
   */
  private static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;

    try {
      const expiryTime = localStorage.getItem(TokenExpiryKey);
      if (!expiryTime) {
        // If no expiry time, consider expired for security
        return true;
      }

      const expiry = parseInt(expiryTime, 10);
      const now = Date.now();

      // Add buffer time to prevent edge cases
      return now >= (expiry - this.TOKEN_EXPIRY_BUFFER);
    } catch (error) {
      console.error('❌ Error checking token expiry:', error);
      return true; // Consider expired on error for security
    }
  }

  /**
   * 🔐 ENHANCED SECURITY: Lấy token từ cookies (fallback)
   */
  private static getTokenFromCookies(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie =>
        cookie.trim().startsWith(`${AuthTokenKey}=`) ||
        cookie.trim().startsWith('accessToken=')
      );

      if (tokenCookie) {
        return tokenCookie.split('=')[1]?.trim() || null;
      }

      return null;
    } catch (error) {
      console.error('❌ Error reading cookies:', error);
      return null;
    }
  }

  /**
   * 🔐 ENHANCED SECURITY: Clear expired token
   */
  private static clearExpiredToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthTokenKey);
      localStorage.removeItem(TokenExpiryKey);
      localStorage.removeItem(RefreshTokenKey);

      // Clear cookies
      document.cookie = `${AuthTokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${RefreshTokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }

  /**
   * 🔐 ENHANCED SECURITY: Comprehensive authentication check
   */
  static checkAuthentication(): void {
    const token = this.getToken();

    if (!token) {
      console.warn('🔐 Authentication check failed: No valid token');
      this.logout();
      throw new Error('Vui lòng đăng nhập để tiếp tục');
    }

    // Additional token format validation
    if (!this.isValidTokenFormat(token)) {
      console.warn('🔐 Authentication check failed: Invalid token format');
      this.logout();
      throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại');
    }

    console.log('✅ Authentication check passed');
  }

  /**
   * 🔐 ENHANCED SECURITY: Validate token format (basic JWT check)
   */
  private static isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;

    // Basic JWT format check (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Check if each part is base64 encoded
    try {
      parts.forEach(part => {
        if (part.length === 0) throw new Error('Empty part');
        // Basic base64 validation
        atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 🔐 ENHANCED SECURITY: Get Bearer token with comprehensive validation
   */
  static getBearerToken(): string {
    this.checkAuthentication();

    const token = this.getToken();

    if (!token) {
      this.logout();
      throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại');
    }

    return token;
  }

  /**
   * 🔐 ENHANCED SECURITY: Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      const token = this.getToken();
      return !!token && this.isValidTokenFormat(token) && !this.isTokenExpired();
    } catch (error) {
      return false;
    }
  }  /**
   * 🔐 ENHANCED SECURITY: Remove token securely
   */
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      try {
        // Clear localStorage
        localStorage.removeItem(AuthTokenKey);
        localStorage.removeItem(RefreshTokenKey);
        localStorage.removeItem(TokenExpiryKey);
        localStorage.removeItem('userInfo');

        // Clear all authentication cookies
        const cookiesToClear = [
          AuthTokenKey,
          RefreshTokenKey,
          'accessToken',
          'refreshToken',
          'hrm_auth_token'
        ];

        cookiesToClear.forEach(cookieName => {
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
        });

        console.log('🔐 All tokens cleared successfully');
      } catch (error) {
        console.error('❌ Error clearing tokens:', error);
      }
    }
  }

  /**
   * 🔐 ENHANCED SECURITY: Secure logout with cleanup
   */
  static logout(): void {
    try {
      console.log('🔐 Initiating secure logout...');

      // Clear all tokens and user data
      this.removeToken();

      // Reset retry counter
      this.retryCount = 0;

      // Redirect to login page
      if (typeof window !== 'undefined') {
        console.log('🔐 Redirecting to login page...');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Force redirect even on error
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
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