from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
from db import get_connection
from utils.chosung import get_chosung_range
from aiokafka import AIOKafkaProducer;
from aiokafka import AIOKafkaConsumer;
import redis.asyncio as redis;
import asyncio;
from contextlib import asynccontextmanager;

redis_client = redis.Redis(host="localhost", port=6379, db=0)

app = FastAPI(title="Movie Catalog API")

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# consumer (FastAPI 애플리케이션 백그라운드에서 실행)
@asynccontextmanager
async def lifespan(app: FastAPI):
    consumer = AIOKafkaConsumer(
        "popular-directors",
        bootstrap_servers="localhost:9092",
        group_id="popular-directors-group"
    )
    await consumer.start()
    print("Kafka consumer started")

    async def consume_popular_director():
        async for msg in consumer:
            name = msg.value.decode("utf-8")
            await redis_client.zincrby("popular-directors", 1, name)
            print(f"Kafka -> Redis: {name}")

    task = asyncio.create_task(consume_popular_director()) # consume을 background로 계속 실행
    try:
        yield
    finally:
        print("shutting down kafka consumer")
        task.cancel()
        await consumer.stop()

app.router.lifespan_context = lifespan

# 인기 감독 조회
@app.get("/popular-directors")
async def get_popular_directors():
    top5 = await redis_client.zrevrange("popular-directors", 0, 4, withscores=True)
    result = [{"name": name.decode("utf-8"), "count": int(score)} for name, score in top5]
    return JSONResponse(content={
        "popular_directors": result
    })

# 영화 목록 조회
@app.get("/movies")
async def list_movies(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    title: Optional[str] = Query(None),
    director: Optional[str] = Query(None),
    year_from: Optional[int] = Query(None),
    year_to: Optional[int] = Query(None),
    status: Optional[List[str]] = Query(None),
    movie_type: Optional[List[str]] = Query(None),
    genre: Optional[List[str]] = Query(None),
    country: Optional[List[str]] = Query(None),
    sort: Optional[str] = Query("release"),
    index: Optional[str] = Query(None)
):
    offset = (page - 1) * size
    filters = []
    params = []

    base_query = """
        FROM movie_info m
        LEFT JOIN movie_nation mc ON m.id = mc.mid
        LEFT JOIN movie_genre mg ON m.id = mg.mid
        LEFT JOIN movie_company mp ON m.id = mp.mid
        LEFT JOIN director_movie dm ON m.id = dm.mid
        LEFT JOIN director d ON dm.did = d.did
        WHERE 1=1
    """

    if title:
        filters.append("(m.mname_kor LIKE %s OR m.mname_eng LIKE %s)")
        params.extend([f"%{title}%", f"%{title}%"])
    if director:
        filters.append("d.dname LIKE %s")
        params.append(f"%{director}%")

        # producer
        conn = get_connection();
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM director WHERE dname = %s", (director,))
                exists = cur.fetchone()
                if exists:
                    producer = AIOKafkaProducer(bootstrap_servers="localhost:9092")
                    await producer.start()
                    try:
                        await producer.send_and_wait("popular-directors", director.encode("utf-8"))
                        print(f"Produced Kafka message: {director}")
                    finally:
                        await producer.stop()

        finally:
            conn.close()
    if year_from is not None and year_to is not None:
        filters.append("m.year BETWEEN %s AND %s")
        params.extend([year_from, year_to])
    elif year_from is not None:
        filters.append("m.year >= %s")
        params.append(year_from)
    elif year_to is not None:
        filters.append("m.year <= %s")
        params.append(year_to)
        
    if index:
        chosung_range = get_chosung_range(index)
        if chosung_range:
            start, end = chosung_range
            filters.append("m.mname_kor >= %s AND m.mname_kor < %s")
            params.extend([start, end])
        elif index.isalpha():
            filters.append("UPPER(m.mname_eng) LIKE %s")
            params.append(f"{index.upper()}%")

    def multi_filter(field: str, values: List[str]):
        return f"({ ' OR '.join([f'{field} LIKE %s' for _ in values]) })", [f"%{v}%" for v in values]

    if status:
        clause, vals = multi_filter("m.state", status)
        filters.append(clause)
        params.extend(vals)
    if movie_type:
        clause, vals = multi_filter("m.type", movie_type)
        filters.append(clause)
        params.extend(vals)
    if genre:
        clause, vals = multi_filter("mg.genre", genre)
        filters.append(clause)
        params.extend(vals)
    if country:
        clause, vals = multi_filter("mc.nation", country)
        filters.append(clause)
        params.extend(vals)

    if filters:
        base_query += " AND " + " AND ".join(filters)

    sort_clause = {
        "recent": "ORDER BY m.id DESC",
        "year": "ORDER BY m.year DESC",
        "title": "ORDER BY m.mname_kor ASC"
    }.get(sort, "ORDER BY m.id DESC")

    try:
        conn = get_connection()
        with conn.cursor() as cur:
            count_sql = f"SELECT COUNT(DISTINCT m.id) AS total {base_query}"
            cur.execute(count_sql, params)
            total = cur.fetchone()["total"]

            data_sql = f"""
                SELECT
                    m.id,
                    m.mname_kor,
                    m.mname_eng,
                    m.year,
                    GROUP_CONCAT(DISTINCT mc.nation) AS nation,
                    m.type,
                    GROUP_CONCAT(DISTINCT mg.genre) AS genre,
                    m.state,
                    GROUP_CONCAT(DISTINCT d.dname) AS dname,
                    GROUP_CONCAT(DISTINCT mp.company) AS company
                {base_query}
                GROUP BY m.id
                {sort_clause}
                LIMIT %s OFFSET %s
            """
            cur.execute(data_sql, params + [size, offset])
            movies = cur.fetchall()
    finally:
        conn.close()

    return JSONResponse(content={
        "total": total,
        "page": page,
        "size": size,
        "items": movies
    })