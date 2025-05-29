from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from typing import Optional
from db import get_connection

app = FastAPI(title="Movie Catalog API")

@app.get("/movies")
def list_movies(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    title: Optional[str] = Query(None),
    director: Optional[str] = Query(None),
    year_from: Optional[int] = Query(None),
    year_to: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    movie_type: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
):
    offset = (page - 1) * size
    filters = []
    params = []

    base_query = """
        FROM movie_info m
        LEFT JOIN director_movie dm ON m.id = dm.mid
        LEFT JOIN director d ON d.did = dm.did
        LEFT JOIN movie_genre mg ON m.id = mg.mid
        LEFT JOIN movie_nation mc ON m.id = mc.mid
        LEFT JOIN movie_company mp ON m.id = mp.mid
        WHERE 1=1
    """

    if title:
        filters.append("(m.mname_kor LIKE %s OR m.mname_eng LIKE %s)")
        params.extend([f"%{title}%", f"%{title}%"])
    if director:
        filters.append("d.dname LIKE %s")
        params.append(f"%{director}%")
    if year_from is not None and year_to is not None:
        filters.append("m.year BETWEEN %s AND %s")
        params.extend([year_from, year_to])
    elif year_from is not None:
        filters.append("m.year >= %s")
        params.append(year_from)
    elif year_to is not None:
        filters.append("m.year <= %s")
        params.append(year_to)
    if status:
        filters.append("m.state LIKE %s")
        params.append(f"%{status}%")
    if movie_type:
        filters.append("m.type LIKE %s")
        params.append(f"%{movie_type}%")
    if genre:
        filters.append("mg.genre LIKE %s")
        params.append(f"%{genre}%")
    if country:
        filters.append("mc.nation LIKE %s")
        params.append(f"%{country}%")

    if filters:
        base_query += " AND " + " AND ".join(filters)

    try:
        conn = get_connection()
        with conn.cursor() as cur:
            # 총 개수 조회
            count_sql = f"SELECT COUNT(DISTINCT m.id) AS total {base_query}"
            cur.execute(count_sql, params)
            total = cur.fetchone()["total"]

            # 영화 목록 조회
            data_sql = f"""
                SELECT DISTINCT m.*
                {base_query}
                ORDER BY m.id DESC
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