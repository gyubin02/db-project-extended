import React from 'react';

interface InputProps {
  name: string;
  setName: (value: string) => void;
}

const Input = ({ name, setName }: InputProps) => {
  return (
    <div>
      <input
        name="movieName"
        value={name}
        onChange={(e) => setName(e.target.value)}     
        style={{width:'400px'}} 
      />
    </div>
  );
};

export default Input; 