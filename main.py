import pandas as pd
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()
config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password' : os.getenv('DB_PASSWORD'),
    'database' : os.getenv('DB_NAME'),
    'charset' : 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# 시트 두 개 읽고 합치기
df1 = pd.read_excel('movie_data.xls', sheet_name='영화정보 리스트', header=4)
df2 = pd.read_excel('movie_data.xls', sheet_name='영화정보 리스트_2', header=None)
df = pd.concat([df1, df2], ignore_index=True)
df = df.fillna('').applymap(lambda x: x.strip() if isinstance(x, str) else x)

# 캐시: 이미 INSERT된 감독 저장 (중복 SELECT 방지)
director_cache = {}

# DB 연결 및 처리
try:
    conn = pymysql.connect(**config)
    cursor = conn.cursor()

    batch_size = 1000
    total = len(df)

    for i in range(0, total, batch_size):
        print(f"▶ Processing rows {i+1} to {min(i+batch_size, total)}")
        batch = df.iloc[i:i + batch_size]

        for _, row in batch.iterrows():
            mname_kor = row['영화명']
            mname_eng = row['영화명(영문)']
            year = int(row['제작연도']) if str(row['제작연도']).isdigit() else None
            mtype = row['유형']
            state = row['제작상태']
            nations = [x.strip() for x in row['제작국가'].split(',') if x.strip()]
            genres = [x.strip() for x in row['장르'].split(',') if x.strip()]
            companies = [x.strip() for x in row['제작사'].split(',') if x.strip()]
            directors = [x.strip() for x in row['감독'].split(',') if x.strip()]

            # 1. Movie_info 삽입
            cursor.execute("""
                INSERT INTO Movie_info (mname_kor, mname_eng, year, type, state)
                VALUES (%s, %s, %s, %s, %s)
            """, (mname_kor, mname_eng, year, mtype, state))
            mid = cursor.lastrowid

            # 2. Movie_nation
            for nation in nations:
                cursor.execute("INSERT INTO Movie_nation (mid, nation) VALUES (%s, %s)", (mid, nation))

            # 3. Movie_genre
            for genre in genres:
                cursor.execute("INSERT INTO Movie_genre (mid, genre) VALUES (%s, %s)", (mid, genre))

            # 4. Movie_company
            for company in companies:
                cursor.execute("INSERT INTO Movie_company (mid, company) VALUES (%s, %s)", (mid, company))

            # 5. Director + 관계 테이블
            for dname in directors:
                if dname in director_cache:
                    did = director_cache[dname]
                else:
                    # SELECT 먼저 (정확한 중복 확인)
                    cursor.execute("SELECT did FROM Director WHERE dname = %s", (dname,))
                    result = cursor.fetchone()
                    if result:
                        did = result['did']
                    else:
                        cursor.execute("INSERT INTO Director (dname) VALUES (%s)", (dname,))
                        did = cursor.lastrowid
                    director_cache[dname] = did

                cursor.execute("INSERT IGNORE INTO Director_movie (did, mid) VALUES (%s, %s)", (did, mid))

        conn.commit()

    print("모든 데이터 삽입 완료.")

except pymysql.Error as err:
    print(f"MySQL 에러 발생: {err}")

finally:
    if conn:
        cursor.close()
        conn.close()
