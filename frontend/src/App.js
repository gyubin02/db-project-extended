import './App.css';
import React, { useState } from 'react';
import CommonButton from './components/common/CommonButton.tsx';
import Input from './components/Input.tsx';
import YearDropdown from './components/YearDropdown.tsx';
import OrderDropdown from './components/OrderDropdown.tsx';
import IndexFilter from './components/IndexFilter.tsx';
import MovieTable from './components/MovieTable.tsx';
import Pagination from './components/Pagination.tsx';
import ProductionStatusModal from './components/ProductionStatusModal.tsx';
import MovieTypeModal from './components/MovieTypeModal.tsx';
import GenreModal from './components/GenreModal.tsx';
import NationalityModal from './components/NationalityModal.tsx';

const styles = {
  container: {
    padding: '24px',
    height: '100vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  searchSection: {
    display: 'flex',
    gap: '100px',
    marginBottom: '16px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    minWidth: '80px',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
  },
};

function App() {
  const [movieName, setMovieName] = useState('');
  const [directorName, setDirectorName] = useState('');
  //시작 연도, 끝 연도
  const [startYear, setStartYear] = useState(1925);
  const [endYear, setEndYear] = useState(2125);

  const [movieData, setMovieData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  //제작상태, 유형, 장르, 국적 (배열)
  const [productionStatus, setProductionStatus] = useState([]);
  const [movieType, setMovieType] = useState([]);
  const [genre, setGenre] = useState([]);
  const [nationality, setNationality] = useState([]);
  //인덱스
  const [selectedIndex, setSelectedIndex] = useState('');
  //정렬 기준
  const [selectedOrder, setSelectedOrder] = useState('latest');
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //제작상태 다이얼로그용
  const [productionModalVisible, setProductionModalVisible] = useState(false);
  const [productionStatusText, setProductionStatusText] = useState('');

  //유형 다이얼로그용
  const [movieTypeModalVisible, setMovieTypeModalVisible] = useState(false);
  const [movieTypeText, setMovieTypeText] = useState('');

  //장르 다이얼로그용
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [genreText, setGenreText] = useState('');

  //국적 다이얼로그용
  const [nationalityModalVisible, setNationalityModalVisible] = useState(false);
  const [nationalityText, setNationalityText] = useState('');

  //검색 파라미터
  const [searchParams, setSearchParams] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (page = 1, size = 10, queryString = '') => {
    if (isLoading) return; // 이미 로딩 중이면 새로운 요청을 무시
    
    try {
      setIsLoading(true);
      const url = `http://localhost:8000/movies?page=${page}&size=${size}${queryString ? `&${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setMovieData(data.items);
      setTotalItems(data.total);
      setCurrentPage(data.page);
      setItemsPerPage(data.size);
      console.log(data);
    } catch (error) {
      console.error('영화 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMovies(currentPage, itemsPerPage, searchParams);
  }, [searchParams]);

  const handleReset = () => {
    setMovieName('');
    setDirectorName('');
    setStartYear(1925);
    setEndYear(2125);
    setCurrentPage(1);
    setSelectedIndex('');
    //제작상태, 유형, 장르, 국적 텍스트 초기화
    setProductionStatusText('');
    setMovieTypeText('');
    setGenreText('');
    setNationalityText('');
    //제작상태, 유형, 장르, 국적 배열 초기화
    setProductionStatus([]);
    setMovieType([]);
    setGenre([]);
    setNationality([]);
    //검색 파라미터 초기화 (정렬 순서는 유지)
    const params = new URLSearchParams();
    if (selectedOrder) {
      params.append("sort", selectedOrder);
    }
    setSearchParams(params.toString());
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
  
    if (movieName && movieName.trim() !== '') {
      params.append("title", movieName.trim());
    }
    if (directorName && directorName.trim() !== '') {
      params.append("director", directorName.trim());
    }
    if (startYear) {
      params.append("year_from", startYear);
    }
    if (endYear) {
      params.append("year_to", endYear);
    }
    if (productionStatus && productionStatus.length > 0) {
      productionStatus.forEach(status => {
        params.append("status", status);
      });
    }
    if (movieType && movieType.length > 0) {
      movieType.forEach(type => {
        params.append("movie_type", type);
      });
    }
    if (genre && genre.length > 0) {
      genre.forEach(g => {
        params.append("genre", g);
      });
    }
    if (nationality && nationality.length > 0) {
      nationality.forEach(nation => {
        params.append("country", nation);
      });
    }
    if (selectedOrder) {
      params.append("sort", selectedOrder);
    }
    if (selectedIndex) {
      params.append("index", selectedIndex);
    }
  
    const queryString = params.toString();
    console.log(queryString);
    setCurrentPage(1);
    setSearchParams(queryString);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (isLoading) return; // 로딩 중이면 페이지 변경 무시
    fetchMovies(page, itemsPerPage, searchParams);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchSection}>
        <div style={styles.inputGroup}>
          <span style={styles.label}>영화명</span>
          <Input name={movieName} setName={setMovieName} />
        </div>
        <div style={styles.inputGroup}>
          <span style={styles.label}>감독명</span>
          <Input name={directorName} setName={setDirectorName} />
        </div>
      </div>

      <div style={{display:'flex', gap:'180px', marginBottom:'16px'}}>
        <div style={styles.inputGroup}>
          <span style={styles.label}>제작연도</span>
          <YearDropdown selectedYear={startYear} setSelectedYear={setStartYear} />
          <span>~</span>
          <YearDropdown selectedYear={endYear} setSelectedYear={setEndYear} />
        </div>
        <div style={styles.inputGroup}>
          <span style={styles.label}>제작상태</span>
          <input
            type="text"
            value={productionStatusText}
            readOnly
            onClick={() => setProductionModalVisible(true)}
            placeholder="선택하세요"
            style={{...styles.inputGroup, width: '400px'}}
          />
        </div>
        <ProductionStatusModal
          visible={productionModalVisible}
          onClose={() => setProductionModalVisible(false)}
          onConfirm={(labels, values) => {
            setProductionStatusText(labels);
            setProductionStatus(values);
          }}
        />
        <div style={styles.buttonGroup}>
          <CommonButton 
            label="조회" 
            color="blue" 
            onClick={handleSearch} 
          />
          <CommonButton 
            label="초기화" 
            color="gray" 
            onClick={handleReset} 
          />  
        </div>
      </div>

      <div style={styles.searchSection}>
        <div style={styles.inputGroup}>
          <span style={styles.label}>유형</span>
          <input
            type="text"
            value={movieTypeText}
            readOnly
            onClick={() => setMovieTypeModalVisible(true)}
            placeholder="선택하세요"
            style={{...styles.inputGroup, width: '400px'}}
          />
        </div>

        <MovieTypeModal
          visible={movieTypeModalVisible}
          onClose={() => setMovieTypeModalVisible(false)}
          onConfirm={(labels, values) => {
            setMovieTypeText(labels);
            setMovieType(values);
          }}
        />
        

        <div style={styles.inputGroup}>
          <span style={styles.label}>장르</span>
          <input
            type="text"
            value={genreText}
            readOnly
            onClick={() => setGenreModalVisible(true)}
            placeholder="선택하세요"
            style={{...styles.inputGroup, width: '400px'}}
          />
        </div>

        <GenreModal
          visible={genreModalVisible}
          onClose={() => setGenreModalVisible(false)}
          onConfirm={(labels, values) => {
            setGenreText(labels);
            setGenre(values);
          }}
        />

      </div>
      <div style={styles.searchSection}>
        <div style={styles.inputGroup}>
          <span style={styles.label}>국적</span>
          <input
            type="text"
            value={nationalityText}
            readOnly
            onClick={() => setNationalityModalVisible(true)}
            placeholder="선택하세요"
            style={{...styles.inputGroup, width: '400px'}}
          />
        </div>
        <NationalityModal
          visible={nationalityModalVisible}
          onClose={() => setNationalityModalVisible(false)}
          onConfirm={(labels, values) => {
            setNationalityText(labels);
            setNationality(values);
          }}
        />
      </div>

      <div style={styles.searchSection}>
        <IndexFilter 
          selected={selectedIndex} 
          onSelect={(char) => {
            setSelectedIndex(char);
            const params = new URLSearchParams(searchParams);
            params.set('index', char);
            const newQueryString = params.toString();
            setSearchParams(newQueryString);
          }} 
        />
      </div>
      <div style={styles.searchSection}>
        <div style={{marginLeft:'auto'}}>
          <OrderDropdown 
            selectedOrder={selectedOrder} 
            setSelectedOrder={(order) => {
              setSelectedOrder(order);
              const params = new URLSearchParams(searchParams);
              params.set('sort', order);
              const newQueryString = params.toString();
              setSearchParams(newQueryString);
              //fetchMovies(1, itemsPerPage, newQueryString);
            }}
          />
        </div>
      </div>

      <MovieTable data={movieData} />
      <div style={{display:'flex', justifyContent:'center'}}>
        <Pagination 
          totalItems={totalItems} 
          itemsPerPage={itemsPerPage} 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
}

export default App;
