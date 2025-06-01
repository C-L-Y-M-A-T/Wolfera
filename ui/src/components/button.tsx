import React, { useState } from "react";

interface ButtonProps {
  variant: "warning" | "success" | "primary";
  size: "lg" | "sm";
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button = ({
  variant,
  size,
  children,
  isLoading,
  ...props
}: ButtonProps) => {
  const buttonStyle = {
    border: "none",
    borderRadius: "4px",
    fontSize: size === "lg" ? "18px" : size === "sm" ? "10px" : "14px",
    backgroundColor:
      variant === "warning"
        ? "#ff0000"
        : variant === "success"
          ? "#2ecc71"
          : "#54a0ff",
    color: "#fff",
    cursor: isLoading ? "default" : "pointer",
  };

  return (
    <button style={buttonStyle} disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="placeholder-glow">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
