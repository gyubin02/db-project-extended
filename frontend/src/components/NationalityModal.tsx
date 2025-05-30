import React, { useState } from 'react';
import DualColumnCheckboxModal from './common/DualColumnCheckboxModal.tsx';

interface NationalityModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedLabels: string, selectedValues: string[]) => void;
}

const allNationalities = [
  // 아시아
  '한국', '대만', '말레이시아', '북한', '싱가포르', '아프카니스탄', '이란', '인도', '중국',
  '태국', '이스라엘', '필리핀', '아랍에미리트연합국정부', '몽고', '티베트', '카자흐스탄', '캄보디아',
  '이라크', '우즈베키스탄', '베트남', '인도네시아', '카타르', '일본', '홍콩',

  // 중남미
  '베네수엘라', '브라질', '아르헨티나', '콜롬비아', '칠레', '페루', '우루과이', '쿠바',

  // 기타
  '기타',

  // 북미주
  '미국', '멕시코', '캐나다', '자메이카', '엘살바도르', '트리니다드토바고', '케이맨제도', '도미니카공화국',

  // 오세아니아&태평양
  '호주', '뉴질랜드', '피지',

  // 유럽
  '그리스', '네덜란드', '덴마크', '독일', '러시아', '벨기에', '스웨덴', '스위스', '스페인', '영국',
  '오스트리아', '이탈리아', '체코', '터키', '포르투갈', '폴란드', '프랑스', '핀란드', '헝가리', '불가리아',
  '보스니아', '크로아티아', '노르웨이', '에스토니아', '아일랜드', '잉글랜드', '아이슬란드', '루마니아',
  '팔레스타인', '세르비아', '룩셈부르크', '마케도니아', '서독', '알바니아', '유고슬라비아', '몰타',
  '우크라이나', '슬로바키아', '총괄(연감)',

  // 아프리카
  '남아프리카공화국', '부탄', '이집트', '나이지리아', '보츠와나', '리비아', '모로코', '케냐',
];

// 1. 정렬
const sorted = [...allNationalities].sort((a, b) => a.localeCompare(b));

// 2. 반 나누기
const middle = Math.ceil(sorted.length / 2);
const leftOptions = sorted.slice(0, middle).map(n => ({ label: n, value: n }));
const rightOptions = sorted.slice(middle).map(n => ({ label: n, value: n }));

const NationalityModal: React.FC<NationalityModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);

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
      title="제작국가 선택"
      leftTitle="제작국가"
      rightTitle="제작국가"
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

export default NationalityModal;
