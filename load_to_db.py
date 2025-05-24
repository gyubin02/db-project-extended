import os
from dotenv import load_dotenv
import pandas as pd
import pymysql

load_dotenv()
DB_HOST     = os.getenv('DB_HOST')
DB_USER     = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME     = os.getenv('DB_NAME')
DB_CHARSET  = os.getenv('DB_CHARSET', 'utf8mb4')
EXCEL_FILE  = os.getenv('EXCEL_FILE')

def create_database():
    conn = pymysql.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD,
        charset=DB_CHARSET, cursorclass=pymysql.cursors.DictCursor
    )
    with conn:
        with conn.cursor() as cur:
            cur.execute(
                f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            )
        conn.commit()

def load_and_model():
    df = pd.read_excel(EXCEL_FILE)
    df = df.where(pd.notnull(df), None)
    df.columns = [
        'title_kr', 'title_en', 'year', 'country',
        'movie_type', 'genre', 'status', 'director', 'production'
    ]

    conn = pymysql.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db=DB_NAME,
        charset=DB_CHARSET, cursorclass=pymysql.cursors.DictCursor
    )
    with conn:
        with conn.cursor() as cur:
            # 테이블 생성
            cur.execute("""
                CREATE TABLE IF NOT EXISTS movie (
                  id          INT AUTO_INCREMENT PRIMARY KEY,
                  title_kr    VARCHAR(255) NOT NULL,
                  title_en    VARCHAR(255),
                  year        INT,
                  country     VARCHAR(255),
                  movie_type  VARCHAR(255),
                  genre       VARCHAR(255),
                  status      VARCHAR(100),
                  production  VARCHAR(255)
                ) CHARACTER SET utf8mb4;
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS director (
                  id   INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(255) NOT NULL UNIQUE
                ) CHARACTER SET utf8mb4;
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS movie_directors (
                  movie_id    INT NOT NULL,
                  director_id INT NOT NULL,
                  PRIMARY KEY (movie_id, director_id),
                  FOREIGN KEY (movie_id)    REFERENCES movie(id)    ON DELETE CASCADE,
                  FOREIGN KEY (director_id) REFERENCES director(id) ON DELETE CASCADE
                ) CHARACTER SET utf8mb4;
            """)

            # SQL
            insert_movie = """
                INSERT INTO movie
                  (title_kr, title_en, year, country,
                   movie_type, genre, status, production)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            insert_director = "INSERT IGNORE INTO director (name) VALUES (%s)"
            select_director = "SELECT id FROM director WHERE name = %s"
            insert_movie_director = """
                INSERT IGNORE INTO movie_directors (movie_id, director_id)
                VALUES (%s, %s)
            """

            for _, row in df.iterrows():
                # 영화 저장
                cur.execute(insert_movie, (
                    row['title_kr'],
                    row['title_en'],
                    row['year'] if pd.notna(row['year']) else None,
                    row['country'],
                    row['movie_type'],
                    row['genre'],
                    row['status'],
                    row['production']
                ))
                movie_id = cur.lastrowid

                # 감독 연결 : n:m
                if row['director']:
                    for name in str(row['director']).split(','):
                        name = name.strip()
                        if not name:
                            continue
                        cur.execute(insert_director, (name,))
                        cur.execute(select_director, (name,))
                        director_id = cur.fetchone()['id']
                        cur.execute(insert_movie_director, (movie_id, director_id))

        conn.commit()
        print("complete !")

if __name__ == '__main__':
    create_database()
    load_and_model()