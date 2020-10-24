/* past tickets of person */
SELECT show_id from tickets WHERE p_id ='GIVEN ID';

/* get all tickets of particular show of a theatre*/
SELECT * from tickets WHERE show_id IN (SELECT show_id from shows WHERE t_id = (SELECT 
theatre_id from theatre WHERE name = '' AND location = ''
));

/*get theaters based on shows*/
SELECT t_id FROM SHOWS WHERE show_id IN (SELECT show_id from tickets WHERE p_id ='GIVEN ID');

/* get payment acc to ticket */
SELECT * from payment INNER JOIN tickets ON payment.t_id = tickets.t_id;