"use client";

import React, { forwardRef, ReactNode } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export interface CustomButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "link"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-light"
    | "outline-dark";
  size?: "sm" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  type?: "button" | "submit" | "reset";
  confirmMessage?: string;
  confirmTitle?: string;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      onClick,
      variant = "primary",
      size,
      disabled = false,
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      style,
      title,
      type = "button",
      confirmMessage,
      confirmTitle = "Xác nhận",
      id,
      role,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      ...rest
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }

      if (confirmMessage) {
        if (window.confirm(confirmMessage)) {
          onClick?.(e);
        }
      } else {
        onClick?.(e);
      }
    };

    // Tận dụng Bootstrap utility classes cho height và layout
    const getHeightClass = () => {
      if (size === "sm") return ""; // Bootstrap default cho btn-sm
      if (size === "lg") return ""; // Bootstrap default cho btn-lg
      return ""; // Bootstrap default cho btn
    };

    // Build classes tận dụng Bootstrap utilities
    const buttonClasses = [
      // Width
      fullWidth ? "w-100" : "",
      // Layout: Flex utilities cho alignment
      "d-flex",
      "align-items-center",
      "justify-content-center",
      // Text: Prevent wrapping
      "text-nowrap",
      // Height class
      getHeightClass(),
      // Custom classes
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Style object sử dụng CSS variables của Bootstrap
    const buttonStyle: React.CSSProperties = {
      // Height sử dụng Bootstrap form control height
      height: size === "sm" ? "31px" : size === "lg" ? "48px" : "37px",
      minHeight: size === "sm" ? "31px" : size === "lg" ? "48px" : "37px",
      lineHeight: "1",
      ...style,
    };

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <Spinner
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1" // Reduced margin for compact layout
            />
            {/* Responsive text using Bootstrap display utilities */}
            <span className="d-none d-sm-inline">
              {typeof children === "string" ? "Đang xử lý..." : children}
            </span>
            <span className="d-inline d-sm-none">...</span>
          </>
        );
      }

      const iconElement = icon && (
        <span
          className={`d-flex align-items-center ${
            iconPosition === "left" ? "me-1" : "ms-1"
          }`}
        >
          {icon}
        </span>
      );

      const textElement = (
        <span className="text-truncate flex-grow-1 text-center">
          {children}
        </span>
      );

      if (icon && iconPosition === "left") {
        return (
          <>
            {iconElement}
            {textElement}
          </>
        );
      }

      if (icon && iconPosition === "right") {
        return (
          <>
            {textElement}
            {iconElement}
          </>
        );
      }

      return textElement;
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={handleClick}
        className={buttonClasses}
        style={buttonStyle}
        title={title}
        type={type}
        id={id}
        role={role}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        {...rest}
      >
        {renderContent()}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
