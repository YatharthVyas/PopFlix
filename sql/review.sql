
/* Get reviews posted by person */
SELECT * from review where p_id = '' 


/*Get reviews according to movies*/
SELECT r.description FROM review AS r WHERE m.m_id=(SELECT m.m_id FROM movies AS m WHERE m.name='name');

