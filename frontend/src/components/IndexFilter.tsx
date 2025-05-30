import React from 'react';

interface IndexFilterProps {
  selected: string;
  onSelect: (value: string) => void;
}

const indexList: string[] = [
  'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

const IndexFilter = ({ selected, onSelect }: IndexFilterProps) => {
  return (
    <div>
      {indexList.map((char) => (
        <button
          key={char}
          onClick={() => onSelect(char)}
          style={{
            border: 'none',
            backgroundColor: selected === char ? '#4d7efb' : 'transparent',
            color: selected === char ? 'white' : 'black',
            fontWeight: selected === char ? 'bold' : 'normal',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            textAlign: 'center',
            cursor: 'pointer',
            lineHeight: '28px',
          }}
        >
          {char}
        </button>
      ))}
    </div>
  );
};

export default IndexFilter;
