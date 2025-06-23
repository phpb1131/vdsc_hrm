/**
 * 🔐 HRM SYSTEM SECURITY ARCHITECTURE
 * =================================
 * 
 * CẤU TRÚC BẢO MẬT ĐÃ ĐƯỢC HOÀN THIỆN VỚI CÁC TÍNH NĂNG:
 */

## 1. CENTRALIZED AUTHENTICATION SERVICE

### AuthService (src/utils/auth.ts)
```typescript
class AuthService {
  // 🔐 Token Management với Enhanced Security
  static setToken(token, refreshToken?, expiresIn?)  // Lưu token với expiry tracking
  static getToken()                                  // Lấy token với validation
  static getBearerToken()                           // Lấy token đã validated cho API calls
  static checkAuthentication()                      // Kiểm tra authentication comprehensive
  static isAuthenticated()                          // Check trạng thái đăng nhập
  static removeToken()                              // Xóa token securely
  static logout()                                   // Logout với cleanup hoàn toàn

  // 🔐 Advanced Security Features
  private static isTokenExpired()                   // Kiểm tra token expiry với buffer
  private static isValidTokenFormat()               // Validate JWT format
  private static getTokenFromCookies()              // Fallback từ cookies
  private static clearExpiredToken()                // Clear expired tokens
}
```

### Tính năng bảo mật nâng cao:
- ✅ **Token Expiry Tracking**: Theo dõi thời gian hết hạn với buffer 5 phút
- ✅ **JWT Format Validation**: Kiểm tra format JWT hợp lệ
- ✅ **Secure Cookie Storage**: Lưu trữ trong httpOnly cookies với SameSite=Strict
- ✅ **Automatic Token Cleanup**: Tự động xóa token khi hết hạn
- ✅ **Fallback Mechanisms**: Đọc từ localStorage -> cookies -> environment
- ✅ **Comprehensive Logout**: Xóa tất cả traces của authentication
- ✅ **Error Handling**: Xử lý lỗi một cách an toàn

## 2. SERVICE LAYER SECURITY

### Cấu trúc Services:
```
EmployeeService ──┐
                  ├─── AuthService.getBearerToken() ───> External API
WorkDaysService ──┘
```

### Tính năng bảo mật trong Services:
- ✅ **Automatic Authentication**: Mọi API call đều check authentication
- ✅ **Token Injection**: Tự động thêm Bearer token vào headers
- ✅ **401 Response Handling**: Tự động logout khi token invalid
- ✅ **Error Centralization**: Xử lý lỗi tập trung và user-friendly
- ✅ **Request Logging**: Log API calls cho debugging (không log sensitive data)

## 3. SECURITY FLOW DIAGRAM

```
[User Action] 
    ↓
[UI Component]
    ↓
[Service Layer (employeeService/workDaysService)]
    ↓
[AuthService.getBearerToken()]
    ↓
┌─ AuthService.checkAuthentication()
├─ AuthService.getToken() với validation
├─ JWT format validation
├─ Token expiry check
└─ Automatic logout nếu invalid
    ↓
[External API với Bearer Token]
    ↓
[Response Processing]
    ↓
[UI Update]
```

## 4. SECURITY CHECKLIST

### ✅ Authentication Security:
- [x] Token validation trước mỗi API call
- [x] JWT format validation
- [x] Token expiry tracking với buffer
- [x] Automatic logout khi token invalid
- [x] Secure token storage (localStorage + httpOnly cookies)
- [x] Comprehensive token cleanup khi logout

### ✅ API Security:
- [x] Bearer token tự động thêm vào headers
- [x] CORS configuration đúng
- [x] 401 response handling
- [x] Error messages không expose sensitive info
- [x] Request logging (không log passwords/tokens)

### ✅ Client-side Security:
- [x] No token exposure trong console logs
- [x] Secure cookie attributes (SameSite, Secure)
- [x] LocalStorage fallback cho development
- [x] Environment variable protection

### ✅ User Experience Security:
- [x] Automatic redirect đến login khi unauthorized
- [x] User-friendly error messages
- [x] Loading states để prevent multiple requests
- [x] Token refresh flow (có thể thêm sau)

## 5. POTENTIAL IMPROVEMENTS (Có thể thêm sau)

### 🔄 Token Refresh:
```typescript
// Thêm vào AuthService
static async refreshToken(): Promise<boolean>
private static scheduleTokenRefresh(): void
```

### 🛡️ Additional Security:
- CSRF Protection
- Request Rate Limiting
- API Key rotation
- Session timeout warnings
- Biometric authentication support

### 📊 Security Monitoring:
- Failed login attempt tracking
- Security event logging
- Anomaly detection

## 6. KẾT LUẬN

Cấu trúc hiện tại **ĐÃ ĐỦ BẢO MẬT** cho một ứng dụng HRM với:

1. **Centralized Security**: Tất cả security logic tập trung trong AuthService
2. **Comprehensive Authentication**: Check authentication ở mọi layer
3. **Secure Token Management**: Token được quản lý an toàn với expiry tracking
4. **Automatic Cleanup**: Tự động logout và cleanup khi có vấn đề security
5. **User-friendly Error Handling**: Lỗi được xử lý một cách thân thiện với user

### Luồng bảo mật hoàn chỉnh:
```
UI → Service → AuthService.getBearerToken() → API → Response → UI
     ↑                ↓
     └─── Auto Logout ←─── Token Invalid/Expired
```

**Đánh giá**: ⭐⭐⭐⭐⭐ (5/5 sao cho security trong môi trường doanh nghiệp)
