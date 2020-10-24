/*Sign up*/
INSERT INTO person (name,gender) values (name,gender);
INSERT INTO customer (Email,Phone,Password) values (Email,Phone,passhash);
INSERT INTO theater (loaction,name,rating) values (loaction,name,0.0);

/*Login */
SELECT email FROM customer WHERE email="given_email";
/*
At server side compare hash, if same allow, else deny.
*/
