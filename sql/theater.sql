/*Get theater by name*/
SELECT * FROM THEATRE WHERE name LIKE '%THEATER%';

/*Get theater by rating*/
SELECT * FROM THEATRE WHERE rating > 'RATING' ORDER BY rating DESC;

/*Get theater by location*/
SELECT * FROM THEATRE AS t WHERE LOCATION='location' GROUP BY t.LOCATION ORDER BY t.rating

/*Get */