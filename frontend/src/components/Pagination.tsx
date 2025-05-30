import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
} : PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 보여줄 페이지 범위 계산
  const getPageRange = () => {
    const pageRange = 5; // 현재 페이지 앞뒤로 보여줄 페이지 수
    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

    // 시작 페이지와 끝 페이지 조정
    if (startPage === 1) {
      endPage = Math.min(10, totalPages);
    }
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 9);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          padding: '4px 8px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        &lt;
      </button>

      {getPageRange().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '4px 8px',
            fontWeight: currentPage === page ? 'bold' : 'normal',
            textDecoration: currentPage === page ? 'underline' : 'none',
            backgroundColor: currentPage === page ? '#e0e0e0' : 'transparent',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          padding: '4px 8px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
