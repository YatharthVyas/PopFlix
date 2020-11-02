/*Get default movies, top 10 current*/
SELECT * FROM movies WHERE release_date < CURDATE() ORDER BY release_date DESC LIMIT 10;

/*Get Movie by name*/
SELECT * FROM movies WHERE name LIKE %'MOVIE'%;

/*Get Movies by langauge*/
SELECT * FROM movies WHERE release_date < CURDATE() AND language="Hi" ORDER BY release_date DESC LIMIT 10;

/* Get shows of particular theatre */
SELECT * FROM shows WHERE t_id = (SELECT t_id from theatre WHERE name='INP');

/*Get price of particular show*/
SELECT s.price FROM SHOWS AS s WHERE s.show_id='id'; 

/*Get time of shows with given movies */
SELECT s.time FROM SHOWS AS s WHERE m_id = (SELECT m_id from movies WHERE NAME ='NAME') ORDER BY s.time ASC;

/*Get shows before particular time*/
SELECT s.time, t.name FROM SHOWS AS s,THEATRE AS t WHERE m_id = (SELECT m_id FROM movies WHERE NAME ='NAME') ORDER BY s.time ASC;

/* implement below query */

ALTER TABLE shows
Change date_time slot time;