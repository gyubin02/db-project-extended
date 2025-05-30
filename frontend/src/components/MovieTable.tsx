import React, { CSSProperties } from 'react';

interface Movie {
  mname_kor: string;
  mname_eng: string;
  code: string;
  year: number;
  nation: string;
  type: string;
  genre: string;
  state: string;
  dname: string;
  company: string;
}

interface MovieTableProps {
  data: Movie[];
}

const styles: Record<string, CSSProperties> = {
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '12px 8px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #ddd',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  td: {
    padding: '12px 8px',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
  },
  tr: {
    backgroundColor: 'transparent',
  },
  trHover: {
    backgroundColor: '#f9f9f9',
  },
  evenRow: {
    backgroundColor: '#fafafa',
  },
};

const MovieTable = ({ data }: MovieTableProps) => {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>영화명</th>
          <th style={styles.th}>영화명(영문)</th>
          <th style={styles.th}>영화코드</th>
          <th style={styles.th}>제작연도</th>
          <th style={styles.th}>제작국가</th>
          <th style={styles.th}>유형</th>
          <th style={styles.th}>장르</th>
          <th style={styles.th}>제작상태</th>
          <th style={styles.th}>감독</th>
          <th style={styles.th}>제작사</th>
        </tr>
      </thead>
      <tbody>
        {data.map((movie, idx) => (
          <tr 
            key={idx} 
            style={{
              ...styles.tr,
              ...(idx % 2 === 0 ? styles.evenRow : {}),
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fafafa' : 'transparent';
            }}
          >
            <td style={styles.td}>{movie.mname_kor}</td>
            <td style={styles.td}>{movie.mname_eng}</td>
            <td style={styles.td}>{movie.code}</td>
            <td style={styles.td}>{movie.year}</td>
            <td style={styles.td}>{movie.nation}</td>
            <td style={styles.td}>{movie.type}</td>
            <td style={styles.td}>{movie.genre}</td>
            <td style={styles.td}>{movie.state}</td>
            <td style={styles.td}>{movie.dname}</td>
            <td style={styles.td}>{movie.company}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MovieTable;
