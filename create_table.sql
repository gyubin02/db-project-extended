use movie;
-- 1. 영화 정보 테이블
CREATE TABLE movie_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mname_kor VARCHAR(255) NOT NULL,
    mname_eng VARCHAR(255),
    year INT,
    type VARCHAR(100),
    state VARCHAR(100)
);

-- 2. 제작국가 (N:1)
CREATE TABLE movie_nation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mid INT NOT NULL,
    nation VARCHAR(100) NOT NULL,
    FOREIGN KEY (mid) REFERENCES movie_info(id) ON DELETE CASCADE
);

-- 3. 장르 (N:1)
CREATE TABLE movie_genre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mid INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    FOREIGN KEY (mid) REFERENCES movie_info(id) ON DELETE CASCADE
);

-- 4. 제작사 (N:1)
CREATE TABLE movie_company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mid INT NOT NULL,
    company VARCHAR(255) NOT NULL,
    FOREIGN KEY (mid) REFERENCES movie_info(id) ON DELETE CASCADE
);

-- 5. 감독
CREATE TABLE director (
    did INT AUTO_INCREMENT PRIMARY KEY,
    dname VARCHAR(255) NOT NULL UNIQUE
);

-- 6. 감독-영화 관계 (N:M)
CREATE TABLE director_movie (
    did INT NOT NULL,
    mid INT NOT NULL,
    PRIMARY KEY (did, mid),
    FOREIGN KEY (did) REFERENCES director(did) ON DELETE CASCADE,
    FOREIGN KEY (mid) REFERENCES movie_info(id) ON DELETE CASCADE
);
