import React from 'react';

interface MovieTypeFilterProps {
  selected: string[];
  onChange: (updated: string[]) => void;
}

const OPTIONS = ['일반영화', '예술영화', '독립영화'];

const MovieTypeFilter = ({ selected, onChange }: MovieTypeFilterProps) => {
  const handleToggle = (type: string) => {
    if (selected.includes(type)) {
      onChange(selected.filter((item) => item !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div>
      {OPTIONS.map((type) => (
        <label key={type} style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={selected.includes(type)}
            onChange={() => handleToggle(type)}
            style={{ marginRight: '6px' }}
          />
          {type}
        </label>
      ))}
    </div>
  );
};

export default MovieTypeFilter;
