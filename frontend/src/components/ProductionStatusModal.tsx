import React, { useState } from 'react';
import DualColumnCheckboxModal from './common/DualColumnCheckboxModal.tsx';

interface ProductionStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedLabels: string, selectedValues: string[]) => void;
}

const ProductionStatusModal: React.FC<ProductionStatusModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedProductionLeft, setSelectedProductionLeft] = useState<string[]>([]);
  const [selectedProductionRight, setSelectedProductionRight] = useState<string[]>([]);

  const statusLeftOptions = [
    { label: '개봉', value: '개봉' },
    { label: '개봉준비', value: '개봉준비' },
    { label: '촬영진행', value: '촬영진행' },
    { label: '기타', value: '기타' },
  ];

  const statusRightOptions = [
    { label: '개봉예정', value: '개봉예정' },
    { label: '후반작업', value: '후반작업' },
    { label: '촬영준비', value: '촬영준비' },
  ];

  const handleConfirm = () => {
    const selectedLabels = [
      ...statusLeftOptions.filter((o) => selectedProductionLeft.includes(o.value)),
      ...statusRightOptions.filter((o) => selectedProductionRight.includes(o.value)),
    ].map((o) => o.label);

    const selectedValues = [...selectedProductionLeft, ...selectedProductionRight];

    onConfirm(selectedLabels.join(', '), selectedValues);
    onClose();
  };

  return (
    <DualColumnCheckboxModal
      visible={visible}
      title="제작상태 선택"
      leftTitle="영화제작상태"
      rightTitle="영화제작상태"
      leftOptions={statusLeftOptions}
      rightOptions={statusRightOptions}
      selectedLeft={selectedProductionLeft}
      selectedRight={selectedProductionRight}
      onChangeLeft={setSelectedProductionLeft}
      onChangeRight={setSelectedProductionRight}
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
};

export default ProductionStatusModal; 