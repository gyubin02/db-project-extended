import React from 'react';

interface OrderDropdownProps {
  selectedOrder: string;
  setSelectedOrder: (order: string) => void;
}

const OrderDropdown = ({ selectedOrder, setSelectedOrder }: OrderDropdownProps) => {
  const orderOptions = [
    { value: "latest", label: "최신업데이트순" },
    { value: "year", label: "제작연도순" }, 
    { value: "title", label: "영화명순(ㄱ~Z)" },
    { value: "release", label: "개봉일순" }
  ];

  return (
    <div>
      <select
        value={selectedOrder}
        onChange={(e) => setSelectedOrder(e.target.value)}
      >
        {orderOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderDropdown; 