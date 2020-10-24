/*Get default movies, top 10 current*/
SELECT * FROM movies WHERE release_date < CURDATE() ORDER BY release_date DESC LIMIT 10;

/* Get shows of particular theatre */
SELECT * FROM shows WHERE t_id = (SELECT t_id from theater WHERE name='INPUT');

/* Get seats status of particular show */
SELECT * from seats WHERE show_id=''; 

/*Get Movie by name*/
SELECT * FROM movies WHERE name LIKE %'MOVIE'%;

/*Get Movies by langauge*/
SELECT * FROM movies WHERE release_date < CURDATE() AND language="Hi" ORDER BY release_date DESC LIMIT 10;

/*Get movie by place*/
SELECT DISTINCT m.name,t.name FROM 
    movies m INNER JOIN shows s 
        ON m.m_id = s.m_id 
    INNER JOIN theater t 
        ON t.t_id=s.t_id 
    WHERE t.location="Cambridge"  
        AND m.release_date < CURDATE()
    ORDER BY m.release_date DESC
    LIMIT 25;

/*Get movies by genre*/
SELECT * FROM movies WHERE m_id IN (SELECT m_id FROM genre WHERE Genre = 'GEN');

/*Get theaters and shows for movies*/
SELECT * FROM 
    movies m INNER JOIN shows s 
        ON m.m_id = s.m_id 
    INNER JOIN theater t 
        ON t.t_id=s.t_id 
    WHERE m.m_id = "id"
    ;

/*Get movies by price*/
SELECT * FROM movies m
    INNER JOIN shows s
    ON s.m_id=m.m_id
    WHERE (SELECT 
                CASE WHEN WEEKDAY(CURDATE()) IN (5,6) THEN
                    s.price+s.weekend_price 
                ELSE
                    s.price
                END) < 300
