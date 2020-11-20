const query = require('../util/db').query();
const connection = require('../util/db').connection();

exports.getBookFlix = async (req, res, next) => {
  try {
    let theaters = await query(`SELECT * from theater;`);
    let indx = 0;
    while (indx < theaters.length) {
      let movies = await query(
        `SELECT name from movies where m_id IN (select m_id from shows where t_id=${theaters[indx].t_id});`
      );
      theaters[indx].movies = movies;
      indx = indx + 1;
    }

    let dropRegions = await query(`SELECT Location FROM theater;`);
    return res.render('Bookings/flix', {
      pg: 'book_flix',
      user: req.user,
      theaters: theaters,
      dropRegions: dropRegions,
    });
  } catch (err) {
    console.log('Error', err);
    /*TODO Error pg */
  }
};

exports.searchFlix = async (req, res) => {
  try {
    const theaterName = req.body.searchmovie;
    const theaterLocation = req.body.region;
    let dropRegions = await query(`SELECT Location FROM theater;`);

    let theaters = {};
    if (req.body.region == 'Region') {
      theaters = await query(
        `SELECT * FROM theater WHERE name LIKE '%${theaterName}%';`
      );
    } else if (req.body.searchmovie == '') {
      theaters = await query(
        `SELECT * FROM theater AS t WHERE location='${theaterLocation}'  ORDER BY t.rating;`
      );
    } else {
      theaters = await query(
        `SELECT * FROM theater AS t WHERE name LIKE '%${theaterName}%' AND t.location='${theaterLocation}' GROUP BY t.location ORDER BY t.rating;`
      );
    }
    let indx = 0;
    while (indx < theaters.length) {
      let movies = await query(
        `SELECT name from movies where m_id IN (select m_id from shows where t_id=${theaters[indx].t_id});`
      );
      theaters[indx].movies = movies;
      indx = indx + 1;
    }

    return res.render('Bookings/flix', {
      pg: 'book_flix',
      user: req.user,
      theaters: theaters,
      dropRegions: dropRegions,
    });
  } catch (err) {
    console.log(err);
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'No such flix or Error Occured',
    });
  }
};

const filterMovieData = (movies) => {
  let indx = 0;
  while (indx < movies.length) {
    let ar = movies[indx].release_date.toString().split(' ');
    let r_date = ar[0] + ' ' + ar[1] + ' ' + ar[2] + ' ' + ar[3];
    movies[indx].release_date = r_date;
    let x = movies[indx].language;
    let y = 'Marathi';
    if (x == 'EN') y = 'English';
    else if (x == 'Hi') y = 'Hindi';
    movies[indx].language = y;
    indx = indx + 1;
  }
  return movies;
};

exports.getMovieFlix = async (req, res) => {
  try {
    let movies = await query(
      `SELECT distinct m.m_id as m_id,m.name as name,m.release_date as release_date,m.language as language from movies m inner join shows s on s.m_id=m.m_id inner join theater t on t.t_id=s.t_id where  release_date < CURDATE() ORDER BY m.release_date DESC;`
    );
    let mov = filterMovieData(movies);

    for (x in mov) {
      let actors = await query(
        `SELECT name from person where p_id IN (select p_id from acted_in where m_id=${mov[x].m_id});`
      );
      mov[x].actors = actors;
    }
    let dropLanguage = await query(`SELECT DISTINCT LANGUAGE FROM movies;`);
    let dropGenre = await query(`SELECT DISTINCT Genre FROM genre;`);

    let indx = 0;
    while (indx < dropLanguage.length) {
      let x = dropLanguage[indx].LANGUAGE;
      if (x == 'EN') dropLanguage[indx].LANGUAGE = 'English';
      else if (x == 'Hi') dropLanguage[indx].LANGUAGE = 'Hindi';
      else dropLanguage[indx].LANGUAGE = 'Marathi';
      indx = indx + 1;
    }

    res.render('Bookings/movie', {
      pg: 'book_movie',
      user: req.user,
      movies: mov,
      dropLanguage: dropLanguage,
      dropGenre: dropGenre,
    });
  } catch (err) {
    console.log(err);
    /*TODO Error pg */
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Error Occured',
    });
  }
};

exports.searchMovie = async (req, res) => {
  try {
    let movieName = req.body.searchMovie;
    let language = req.body.lang;
    let genre = req.body.genre;
    let dropLanguage = await query(`SELECT DISTINCT LANGUAGE FROM movies;`);
    let dropGenre = await query(`SELECT DISTINCT Genre FROM genre;`);
    let indx = 0;
    while (indx < dropLanguage.length) {
      let x = dropLanguage[indx].LANGUAGE;
      if (x == 'EN') dropLanguage[indx].LANGUAGE = 'English';
      else if (x == 'Hi') dropLanguage[indx].LANGUAGE = 'Hindi';
      else dropLanguage[indx].LANGUAGE = 'Marathi';
      indx = indx + 1;
    }

    let mov = {};
    if (language == 'Language' && genre == 'Genre') {
      mov = await query(
        `SELECT * FROM movies WHERE name LIKE '%${movieName}%';`
      );
    } else if (movieName == '' && genre == 'Genre') {
      if (language == 'English') language = 'EN';
      else if (language == 'Hindi') language = 'Hi';
      else language = 'Ma';
      mov = await query(`SELECT * FROM movies WHERE language='${language}';`);
    } else if (movieName == '' && language == 'Language') {
      mov = await query(
        `SELECT * FROM movies AS m WHERE m.m_id IN (SELECT m_id from genre where genre='${genre}');`
      );
    } else if (genre == 'Genre') {
      if (language == 'English') language = 'EN';
      else if (language == 'Hindi') language = 'Hi';
      else language = 'Ma';
      mov = await query(
        `SELECT * FROM movies WHERE name LIKE '%${movieName}%' AND language='${language}';`
      );
    } else if (movieName == '') {
      if (language == 'English') language = 'EN';
      else if (language == 'Hindi') language = 'Hi';
      else language = 'Ma';
      mov = await query(
        `SELECT * FROM movies AS m WHERE m.language='${language}' AND m.m_id IN (SELECT m_id from genre where genre='${genre}');`
      );
    } else if (language == 'Language') {
      mov = await query(
        `SELECT * FROM movies AS m WHERE m.name LIKE '%${movieName}%' AND m.m_id IN (SELECT m_id from genre where genre='${genre}');`
      );
    } else {
      if (language == 'English') language = 'EN';
      else if (language == 'Hindi') language = 'Hi';
      else language = 'Ma';
      mov = await query(
        `SELECT * FROM movies AS m WHERE m.name LIKE '%${movieName}%' AND m.language='${language}' AND m.m_id IN (SELECT m_id from genre where genre='${genre}');`
      );
    }

    mov = filterMovieData(mov);
    for (x in mov) {
      let actors = await query(
        `SELECT name from person where p_id IN (select p_id from acted_in where m_id=${mov[x].m_id});`
      );
      mov[x].actors = actors;
    }

    res.render('Bookings/movie', {
      pg: 'book_movie',
      user: req.user,
      movies: mov,
      dropLanguage: dropLanguage,
      dropGenre: dropGenre,
    });
  } catch (err) {
    console.log(err);
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'No such movie or Error Occured',
    });
  }
};

exports.getSelectFlix = async (req, res) => {
  const id = req.params.movieId;

  try {
    let theater = await query(`SELECT * FROM
      movies m INNER JOIN shows s
    	  ON m.m_id = s.m_id
      INNER JOIN theater t
    	  ON t.t_id=s.t_id
      WHERE m.m_id = ${id}
      ;`);

    let indx = 0;
    while (indx < theater.length) {
      let movies = await query(
        `SELECT name from movies where m_id IN (select m_id from shows where t_id=${theater[indx].t_id});`
      );
      theater[indx].movies = movies;
      indx = indx + 1;
    }
    res.render('Bookings/select_flix', {
      user: req.user,
      pg: 'select_flix',
      theater: theater,
      movieId: id,
    });
  } catch (err) {
    console.log(err);
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Error Occured',
    });
  }
};
exports.getSelectSeat = async (req, res) => {
  let { date, show_id } = req.query;
  //! TODO try-catch
  let seats = await query(
    `select * from seats where theater_id=(select t_id from shows where show_id=${show_id}) order by s_id ASC`
  );

  let base_cost = await query(
    `select CASE WHEN WEEKDAY(${date}) IN (5,6) THEN s.price+s.weekend_price ELSE s.price END AS cost from shows s where show_id=${show_id}`
  );

  let booked = await query(
    `select b.seat_id from ticket t Inner join booking b on t.payment_id=b.payment where t.show_id=${Number(
      show_id
    )} and t.dt="${date}"`
  );
  booked = booked.map((a) => {
    return a.seat_id - seats[0].s_id + 1;
  });
  res.render('Bookings/seat', {
    user: req.user,
    pg: 'select_seat',
    base_id: seats[0].s_id,
    base_cost: base_cost[0].cost,
    seats: JSON.stringify(seats),
    booked: JSON.stringify(booked),
  });
};

exports.getSelectMovie = async (req, res) => {
  const id = req.params.theaterId;

  try {
    let movies = await query(
      `SELECT * from movies where m_id IN (select m_id from shows where t_id=${id});`
    );
    let mov = filterMovieData(movies);

    for (x in mov) {
      let actors = await query(
        `SELECT name from person where p_id IN (select p_id from acted_in where m_id=${mov[x].m_id});`
      );
      mov[x].actors = actors;
    }
    res.render('Bookings/select_movie', {
      pg: 'select_movie',
      user: req.user,
      movies: mov,
      theaterId: id,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getSelectTime = async (req, res) => {
  let t_id = req.query.theater;
  let m_id = req.query.movie;

  try {
    let shows = await query(
      `select * from shows where t_id=${t_id} and m_id=${m_id};`
    );
    res.render('Bookings/select_time', {
      user: req.user,
      pg: 'select_time',
      shows: shows,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getConfirmPayment = async (req, res) => {
  let { date, flix_id, show_id, seat_id } = req.body;

  try {
    // get cost
    let res1 = await query(`select SUM(price+(case when weekday(${date}) in (5,6) then weekend_price else 0 end)+seat_price) as cost
    from movies m Inner join  shows sh on sh.m_id=m.m_id Inner join seats s on sh.t_id=s.theater_id 
    where s.s_id in (${seat_id}) and show_id=${show_id};`);

    let cost = res1[0].cost;

    res1 = await query('lock tables ticket write,payment write,booking write;');
    connection.beginTransaction();
    res1 = await query(
      `select * from ticket Inner join booking on payment_id=payment where show_id=${show_id} and seat_id in (${seat_id})  and dt=${date};`
    );

    // Some of selected seats are already booked
    if (res1.length !== 0) {
      connection.rollback();
      await query('unlock tables;');
      res.render('Error/error', {
        pg: 'error',
        user: req.user,
        error: 'Selected seats are already booked',
      });
      return;
    }

    // add payment
    res1 = await query(
      `insert into payment (timeAndDateOfPurchase,amount,c_id) values (NOW(),${cost},${req.user.p_id});`
    );

    let payment_id = res1.insertId;

    // add booking
    let temp = seat_id.split(',');

    for (t in temp) {
      res1 = await query(
        `insert into booking (payment,seat_id) values (${payment_id},${temp[t]});`
      );
    }

    // add ticket
    res1 = await query(
      `insert into ticket (dt,show_id,payment_id,p_id) values ("${date}",${show_id},${payment_id},${req.user.p_id})`
    );

    connection.commit();
    await query('unlock tables;');

    res1 = await query(`select slot from shows where show_id=${show_id};`);
    const slot = res1[0].slot;

    res1 = await query(`select name from theater where t_id=${flix_id}`);
    const theater = res1[0].name;
    res1 = await query(
      `select s_id from seats where theater_id=${flix_id} order by s_id limit 1;`
    );
    const base_id = res1[0].s_id;
    res1 = await query(`select name from movies where m_id=(Select m_id from shows where show_id=${show_id});`);
    const movie = res1[0].name;
    res.render('Bookings/confirm_payment', {
      user: req.user,
      pg: 'confirm_payment',
      movie: movie,
      seats: seat_id
        .split(',')
        .map((id) => {
          return Number(id);
        })
        .map((id) => {
          return id - base_id + 1;
        })
        .join(','),
      theater: theater,
      slot: slot,
      date: date,
    });
  } catch (e) {
    console.log(e);
    connection.rollback();
    await query('unlock tables;');

    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Some Error Occured',
    });
  }
};
