import React, { useState } from 'react';
import DualColumnCheckboxModal from './common/DualColumnCheckboxModal.tsx';

interface GenreModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedLabels: string, selectedValues: string[]) => void;
}

const GenreModal: React.FC<GenreModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);

  const leftOptions = [
    { label: '드라마', value: '드라마' },
    { label: '액션', value: '액션' },
    { label: '스릴러', value: '스릴러' },
    { label: '공포(호러)', value: '공포(호러)' },
    { label: '범죄', value: '범죄' },
    { label: '판타지', value: '판타지' },
  ];

  const rightOptions = [
    { label: '코미디', value: '코미디' },
    { label: '멜로/로맨스', value: '멜로/로맨스' },
    { label: '미스터리', value: '미스터리' },
    { label: '어드벤처', value: '어드벤처' },
    { label: '가족', value: '가족' },
    { label: 'SF', value: 'SF' },
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
      title="장르 선택"
      leftTitle="장르"
      rightTitle="장르"
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

export default GenreModal;
