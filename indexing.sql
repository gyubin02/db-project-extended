
-- movie_info
create index idx_mname_kor on movie_info (mname_kor);
create index idx_mname_eng on movie_info (mname_eng);
create index idx_year on movie_info (year);
create index idx_type on movie_info (type);
create index idx_state on movie_info (state);

-- movie_nation
create index idx_movie_nation_mid on movie_nation (mid);
create index idx_movie_nation_nation on movie_nation (nation);

-- movie_genre
create index idx_movie_genre_mid on movie_genre (mid);
create index idx_movie_genre_genre on movie_genre (genre);

-- movie_company
create index idx_movie_company_mid on movie_company (mid);

-- director_movie
create index idx_director_movie_mid on director_movie (mid);
create index idx_director_movie_did on director_movie (did);

-- director
create index idx_director_mid on director (did);
create index idx_director_dname on director (dname);