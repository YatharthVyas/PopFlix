
/* Get reviews posted by person */
SELECT * from review where p_id = '' 


/*Get reviews according to movies*/
SELECT description FROM REVIEW AS r WHERE m.m_id=(SELECT m.m_id FROM MOVIES AS m WHERE m.name='name');

