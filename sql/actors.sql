/* actors associated with particular movie  */
SELECT * from actor WHERE p_id IN (SELECT p_id from acted_in WHERE m_id="Given movie");

/* get list of actors based on rating */
SELECT * from actor ORDER BY rating DESC LIMIT 15;

/* get movies by actor name */
SELECT * from movies WHERE m_id IN (SELECT m_id from acted_in WHERE p_id = (SELECT p_id from person where name='ACTOR'))