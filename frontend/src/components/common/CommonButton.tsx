import React from "react";

interface CommonButtonProps {
  label: string;
  color: "blue" | "gray";
  onClick: () => void;
}

const CommonButton = ({ label, color, onClick }: CommonButtonProps) => {
  const backgroundColor = color === "blue" ? "#4d7efb" : "#555";

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor,
        color: "white",
        border: "none",
        padding: "10px 16px",
        marginRight: "8px",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      {label}
    </button>
  );
};

export default CommonButton;