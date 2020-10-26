CREATE TABLE theatre( 
    `theatre_id` INT NOT NULL , 
    `name` INT NOT NULL , 
    `location` INT NOT NULL , 
    `rating` FLOAT(1) check(rating BETWEEN 0.0 AND 5.0) , 
    constraint PRIMARY KEY (theatre_id) 
    );

CREATE TABLE theater_user(
    `theatre_id` INT NOT NULL , 
    `password` varchar(30)
);

CREATE TABLE movies( 
    m_id int, name varchar(30), 
    release_date Date, 
    language ENUM('EN','Hi','Ma') 
    constraint PRIMARY KEY (m_id) 
    ); 
-- Alter TABLE movies add constraint primary key(m_id);

CREATE TABLE genre( 
    m_id int, 
    Genre ENUM('COMEDY','HORROR','ROMANTIC','ADVENTURE'), 
    constraint fk_mid foreign key(m_id) references movies(m_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE shows( 
    show_id int auto_increment, 
    date_time datetime, 
    price int check(price>0), 
    t_id int, 
    weekend_price int check(weekend_price>=0),
    m_id int, 
    constraint primary key(show_id), 
    constraint fk_tid_show foreign key(t_id) references theatre(theatre_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, 
    constraint fk_mid_show foreign key(m_id) references movies(m_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE seats( 
    s_id int, 
    allocated boolean, 
    seat_price int check(seat_price>=0), 
    show_id int, 
    constraint primary key(s_id), 
    constraint fk_sid_seats foreign key(show_id) references shows(show_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE person( 
    p_id int, 
    name varchar(50), 
    gender ENUM('M','F','O'), 
    constraint primary key(p_id) 
    );

CREATE TABLE ticket( 
    ticket_id int, 
    addon_meal boolean default 0, 
    show_id int, 
    seat_id int, 
    p_id int, 
    gs_tax float(2), 
    total_price float(2) check(total_price>0), 
    constraint primary key(ticket_id), 
    constraint fk_shid_ticket foreign key(show_id) references shows(show_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, constraint fk_sid_ticket foreign key(seat_id) references seats(s_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, constraint fk_pid_ticket foreign key(p_id) references person(p_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE actor( 
    p_id int, 
    rating float(1) check(rating BETWEEN 0 AND 10), 
    constraint primary key(p_id), 
    constraint fk_pid_actor foreign key(p_id) references person(p_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE customer( 
    p_id int, 
    Email varchar(30) UNIQUE, 
    Phone varchar(10) UNIQUE, 
    constraint primary key(p_id), 
    constraint fk_pid_customer foreign key(p_id) references person(p_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE acted_in( 
    p_id int, 
    m_id int, 
    constraint primary key(p_id,m_id), 
    constraint fk_pid_actedin foreign key(p_id) references actor(p_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, 
    constraint fk_mid_actedin foreign key(p_id) references movies(m_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE review( 
    m_id int, 
    p_id int, 
    description varchar(150), 
    constraint primary key(p_id,m_id), 
    constraint fk_mid_review foreign key(m_id) references movies(m_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, 
    constraint fk_pid_review foreign key(p_id) references person(p_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
    );

CREATE TABLE payment(
    payment_id int UNIQUE,
    timeAndDateOfPurchase datetime,
    amount int,
    constraint fk_t_id_payment foreign key(t_id) references ticket(t_id)
    constraint fk_c_id_payment foreign key(c_id) references customer(c_id)
    );