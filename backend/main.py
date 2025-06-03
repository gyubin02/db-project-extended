from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
from db import get_connection
from utils.chosung import get_chosung_range

app = FastAPI(title="Movie Catalog API")

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/movies")
def list_movies(
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