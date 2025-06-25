# db-project

## backend
- Install requirements
```bash
pip install -r requirements.txt
```

- Run FastAPI server
```bash
uvicorn main:app --reload
```
## frontend
- Install requirements
```bash
npm install
```

- run development server
```bash
npm start
```


## 확장 기능 (Extension Features)

과제의 요구사항인 영화 검색 기능을 넘어 **데이터 엔지니어링 기술**을 접목하여 다음과 같은 기능 확장을 수행하였습니다:

### 실시간 인기 감독 집계 시스템 (Real-time Popular Director Tracking)

- **목표**: 사용자의 검색 데이터를 기반으로 인기 감독을 실시간으로 집계 및 제공
- **구현 구성요소**:
  - **Apache Kafka**: 사용자 검색 이벤트를 비동기적으로 수집하는 메시지 브로커 역할
  - **Kafka Consumer**: 검색 로그를 수신하여 감독 검색 횟수를 Redis에 저장
  - **Redis (ZSET)**: 감독 검색 횟수를 실시간으로 누적하여 상위 5명을 정렬된 형태로 저장
- **API 제공**:
  - `GET /popular-directors`: 현재 인기 감독 Top 5를 조회하는 REST API
- **프론트엔드 기능**:
  - 실시간 인기 감독 정보를 주기적으로 요청하여 순위 갱신

### 기술 스택 요약

| 기술 | 사용 목적 |
|------|------------|
| Kafka | 이벤트 스트리밍 및 로그 수집 |
| Redis | 인기 감독 데이터의 실시간 저장 및 빠른 조회 |
| FastAPI | 비동기 REST API 서버 |
| React | 사용자 인터페이스 |
| MySQL | 영화 정보 저장 |
