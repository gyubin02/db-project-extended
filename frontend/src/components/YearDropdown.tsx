import React from 'react';

interface YearDropdownProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

const YearDropdown = ({ selectedYear, setSelectedYear }: YearDropdownProps) => {
  const years:number[] = [];
  for(let year = 1925; year <= 2125; year++) {
    years.push(year);
  }

  return (
    <div>
      <select 
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        style={{width:'150px'}}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearDropdown; 