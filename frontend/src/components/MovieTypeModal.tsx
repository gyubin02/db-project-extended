import React, { useState } from 'react';
import DualColumnCheckboxModal from './common/DualColumnCheckboxModal.tsx';

interface MovieTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedLabels: string, selectedValues: string[]) => void;
}

const MovieTypeModal: React.FC<MovieTypeModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);

  const leftOptions = [
    { label: '장편', value: '장편' },
    { label: '옴니버스', value: '옴니버스' },
    { label: '기타', value: '기타' },
  ];

  const rightOptions = [
    { label: '단편', value: '단편' },
    { label: '온라인전용', value: '온라인전용' },
  ];

  const handleConfirm = () => {
    const selectedLabels = [
      ...leftOptions.filter((o) => selectedLeft.includes(o.value)),
      ...rightOptions.filter((o) => selectedRight.includes(o.value)),
    ].map((o) => o.label);

    const selectedValues = [...selectedLeft, ...selectedRight];

    onConfirm(selectedLabels.join(', '), selectedValues);
    onClose();
  };

  return (
    <DualColumnCheckboxModal
      visible={visible}
      title="영화형태 선택"
      leftTitle="영화형태"
      rightTitle="영화형태"
      leftOptions={leftOptions}
      rightOptions={rightOptions}
      selectedLeft={selectedLeft}
      selectedRight={selectedRight}
      onChangeLeft={setSelectedLeft}
      onChangeRight={setSelectedRight}
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
};

export default MovieTypeModal;
