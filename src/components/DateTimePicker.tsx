import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { Form, InputGroup } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "lg";
  className?: string;
  showTime?: boolean; // Thêm option bật/tắt time picker
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "lg";
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, placeholder, disabled, size }, ref) => (
    <InputGroup size={size} className="w-100">
      <Form.Control
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
      />
    </InputGroup>
  )
);

CustomInput.displayName = "CustomInput";

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  size,
  className = "",
  showTime = false, // Mặc định tắt time picker
}) => {
  // Tự động điều chỉnh placeholder và dateFormat dựa trên showTime
  const defaultPlaceholder = showTime ? "Chọn ngày/giờ..." : "Chọn ngày...";
  const dateFormat = showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";

  return (
    <div style={{ width: "100%" }} className={className}>
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect={showTime}
        timeFormat={showTime ? "HH:mm" : undefined}
        timeIntervals={showTime ? 15 : undefined}
        dateFormat={dateFormat}
        customInput={
          <CustomInput
            placeholder={placeholder || defaultPlaceholder}
            disabled={disabled}
            size={size}
          />
        }
        disabled={disabled}
        required={required}
        isClearable
        placeholderText={placeholder || defaultPlaceholder}
        wrapperClassName="w-100"
      />
    </div>
  );
};

export default DateTimePicker;
