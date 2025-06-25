// components/TopDirectorList.tsx
import React, { useEffect, useState } from 'react';

type TopDirector = {
  name: string;
  count: number;
}

function TopDirectorList() {
  const [topDirectors, setTopDirectors] = useState<TopDirector[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/popular-directors');
      const data = await res.json();
      setTopDirectors(data.popular_directors);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 10초마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minWidth: '250px' }}>
      <h4>인기 감독</h4>
      <ul>
        {topDirectors.map((item, index) => (
          <li key={item.name}>
            {index + 1}등 {item.name} :{item.count}번 검색
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopDirectorList;
