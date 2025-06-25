import React from "react";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "./DateTimePicker";

interface DateRangePickerProps {
  /**
   * Giá trị ngày bắt đầu
   */
  startDate: Date | null;
  /**
   * Giá trị ngày kết thúc
   */
  endDate: Date | null;
  /**
   * Callback khi ngày bắt đầu thay đổi
   */
  onStartDateChange: (date: Date | null) => void;
  /**
   * Callback khi ngày kết thúc thay đổi
   */
  onEndDateChange: (date: Date | null) => void;
  /**
   * Placeholder cho input từ ngày
   */
  startPlaceholder?: string;
  /**
   * Placeholder cho input đến ngày
   */
  endPlaceholder?: string;
  /**
   * Hiển thị thời gian hay chỉ ngày
   */
  showTime?: boolean;
  /**
   * Size của input
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
  /**
   * Label cho từ ngày
   */
  startLabel?: string;
  /**
   * Label cho đến ngày
   */
  endLabel?: string;
  /**
   * Hiển thị label hay không
   */
  showLabels?: boolean;
}

/**
 * DateRangePicker Component - Cặp DatePicker cho khoảng thời gian từ-đến
 *
 * @example
 * <DateRangePicker
 *   startDate={startDate}
 *   endDate={endDate}
 *   onStartDateChange={setStartDate}
 *   onEndDateChange={setEndDate}
 *   showTime={false}
 *   showLabels={true}
 * />
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startPlaceholder = "Từ ngày...",
  endPlaceholder = "Đến ngày...",
  showTime = false,
  size,
  disabled = false,
  required = false,
  className = "",
  startLabel = "Từ ngày",
  endLabel = "Đến ngày",
  showLabels = false,
}) => {
  // Validation: Ngày kết thúc không được nhỏ hơn ngày bắt đầu
  const handleStartDateChange = (date: Date | null) => {
    onStartDateChange(date);

    // Nếu ngày bắt đầu lớn hơn ngày kết thúc, reset ngày kết thúc
    if (date && endDate && date > endDate) {
      onEndDateChange(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    // Cảnh báo nếu ngày kết thúc nhỏ hơn ngày bắt đầu
    if (date && startDate && date < startDate) {
      alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!");
      return;
    }

    onEndDateChange(date);
  };

  return (
    <div className={`date-range-picker ${className}`}>
      <Row className="g-2 align-items-end">
        {/* Từ ngày */}
        <Col xs={12} sm={6}>
          {showLabels && (
            <label className="form-label small text-muted mb-1">
              {startLabel}
              {required && <span className="text-danger ms-1">*</span>}
            </label>
          )}
          <DateTimePicker
            value={startDate}
            onChange={handleStartDateChange}
            placeholder={startPlaceholder}
            showTime={showTime}
            size={size}
            disabled={disabled}
            required={required}
          />
        </Col>

        {/* Đến ngày */}
        <Col xs={12} sm={6}>
          {showLabels && (
            <label className="form-label small text-muted mb-1">
              {endLabel}
              {required && <span className="text-danger ms-1">*</span>}
            </label>
          )}
          <DateTimePicker
            value={endDate}
            onChange={handleEndDateChange}
            placeholder={endPlaceholder}
            showTime={showTime}
            size={size}
            disabled={disabled}
            required={required}
          />
        </Col>
      </Row>

      {/* Validation message */}
      {startDate && endDate && startDate > endDate && (
        <div className="text-danger small mt-1">
          <i className="bi bi-exclamation-triangle me-1"></i>
          Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu
        </div>
      )}

      {/* Summary */}
      {startDate && endDate && startDate <= endDate && (
        <div className="text-muted small mt-1">
          <i className="bi bi-info-circle me-1"></i>
          Khoảng thời gian:{" "}
          {Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          )}{" "}
          ngày
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
