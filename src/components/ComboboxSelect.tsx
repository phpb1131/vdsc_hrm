import React, { useState, useEffect, memo } from "react";
import Form from "react-bootstrap/Form";
import { AuthService } from "../utils/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7251";

// 🔑 Global cache để tránh gọi API duplicate (tồn tại ngoài component lifecycle)
const globalCache = new Map<
  string,
  {
    data: ComboboxItem[];
    timestamp: number;
    loading: Promise<ComboboxItem[]> | null;
  }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

interface ComboboxItem {
  maDanhMuc: string;
  giaTriDanhMuc: string;
  giaTriDanhMucEn: string;
  dienGiai: string;
}

interface ComboboxSelectProps {
  /**
   * ParamType để gọi API (VD: "SANPHAM", "PHONGBAN", etc.)
   */
  paramType: string;
  /**
   * ParamCode (optional)
   */
  paramCode?: string;
  /**
   * UserId (default: "CCQ_VDAM")
   */
  userId?: string;
  /**
   * Value hiện tại được chọn
   */
  value?: string;
  /**
   * Callback khi value thay đổi
   */
  onChange?: (value: string, selectedItem?: ComboboxItem) => void;
  /**
   * Placeholder cho option đầu tiên
   */
  placeholder?: string;
  /**
   * Size của select
   */
  size?: "sm" | "lg";
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Required field
   */
  required?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * ComboboxSelect Component - Select dropdown với dữ liệu từ API
 *
 * @example
 * <ComboboxSelect
 *   paramType="SANPHAM"
 *   value={selectedProduct}
 *   onChange={(value, item) => setSelectedProduct(value)}
 *   placeholder="Chọn sản phẩm..."
 * />
 */
export const ComboboxSelect = memo<ComboboxSelectProps>(
  ({
    paramType,
    paramCode = "",
    userId = "CCQ_VDAM",
    value = "",
    onChange,
    placeholder = "Chọn...",
    size,
    disabled = false,
    required = false,
    className = "",
  }) => {
    const [items, setItems] = useState<ComboboxItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Gọi API để lấy dữ liệu combobox với global cache
     */ const fetchComboboxData = async () => {
      const cacheKey = `${paramType}-${paramCode}-${userId}`;

      // 🔑 Kiểm tra cache trước
      const cached = globalCache.get(cacheKey);
      if (cached) {
        // Nếu đang loading, đợi kết quả
        if (cached.loading) {
          try {
            const result = await cached.loading;
            setItems(result);
            return;
          } catch (error) {
            // Nếu lỗi, tiếp tục fetch mới
          }
        }

        // Nếu có data và chưa hết hạn
        if (cached.data && Date.now() - cached.timestamp < CACHE_DURATION) {
          setItems(cached.data);
          return;
        }
      }
      try {
        setLoading(true);
        setError(null);

        // 🔑 Tạo promise và lưu vào cache ngay lập tức để tránh duplicate calls
        const fetchPromise = (async (): Promise<ComboboxItem[]> => {
          const token = AuthService.getBearerToken();

          const requestBody = {
            ParamType: paramType,
            ParamCode: paramCode,
            UserId: userId,
          };

          const response = await fetch(
            `${API_BASE_URL}/admin/CustomerSanPhamDauTu/DanhMucForCombobox`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              mode: "cors",
              credentials: "omit",
              body: JSON.stringify(requestBody),
            }
          );

          if (response.status === 401) {
            AuthService.logout();
            throw new Error("Phiên đăng nhập đã hết hạn");
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Lỗi API: ${response.status}`);
          }

          const data = await response.json();
          if (data.success && data.entity) {
            return data.entity;
          } else {
            throw new Error(data.message || "Không có dữ liệu");
          }
        })();

        // Lưu promise vào cache
        globalCache.set(cacheKey, {
          data: [],
          timestamp: Date.now(),
          loading: fetchPromise,
        });

        const result = await fetchPromise;

        // Cập nhật cache với data thực
        globalCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          loading: null,
        });

        setItems(result);
      } catch (error) {
        console.error(
          `❌ Error loading combobox data for ${paramType}:`,
          error
        );
        setError(
          error instanceof Error ? error.message : "Không thể tải dữ liệu"
        );
        setItems([]);

        // Xóa cache khi có lỗi
        globalCache.delete(cacheKey);
      } finally {
        setLoading(false);
      }
    };
    /**
     * Load dữ liệu khi component mount hoặc paramType thay đổi
     */ useEffect(() => {
      if (paramType) {
        fetchComboboxData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramType]); // 🔑 Chỉ depend vào paramType, bỏ paramCode và userId

    /**
     * Xử lý khi user thay đổi selection
     */
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value;
      const selectedItem = items.find(
        (item) => item.maDanhMuc === selectedValue
      );

      if (onChange) {
        onChange(selectedValue, selectedItem);
      }
    };

    /**
     * Render loading state
     */
    if (loading) {
      return (
        <Form.Select size={size} disabled className={className}>
          <option>Đang tải...</option>
        </Form.Select>
      );
    }

    /**
     * Render error state
     */
    if (error) {
      return (
        <Form.Select size={size} disabled className={className}>
          <option>❌ {error}</option>
        </Form.Select>
      );
    }

    /**
     * Render normal select
     */
    return (
      <Form.Select
        size={size}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={className}
      >
        <option value="">{placeholder}</option>
        {items.map((item) => (
          <option key={item.maDanhMuc} value={item.maDanhMuc}>
            {item.giaTriDanhMuc}
          </option>
        ))}{" "}
      </Form.Select>
    );
  }
);

ComboboxSelect.displayName = "ComboboxSelect";
export default ComboboxSelect;
