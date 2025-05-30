import React from 'react';

interface DatePickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DatePicker = ({ selectedDate, setSelectedDate }: DatePickerProps) => {
  return (
    <div>
      <input 
        type="date" 
        value={selectedDate.toISOString().split('T')[0]} 
        onChange={(e) => setSelectedDate(new Date(e.target.value))} 
        style={{width:'150px'}}
      />
    </div>
  );
};

export default DatePicker; 