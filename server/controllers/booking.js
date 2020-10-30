const query = require('../util/db').query();

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

    return res.render('Bookings/flix', {
      pg: 'book_flix',
      user: req.user,
      theaters: theaters,
    });
  } catch (err) {
    console.log(err);
    /*TODO Error pg */
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
      //   `SELECT * FROM movies WHERE release_date < CURDATE() ORDER BY release_date DESC LIMIT 10;`
      `SELECT * FROM movies WHERE release_date < CURDATE() ORDER BY release_date DESC;`
    );
    let mov = filterMovieData(movies);
    res.render('Bookings/movie', {
      pg: 'book_movie',
      user: req.user,
      movies: mov,
    });
  } catch (err) {
    console.log(err);
    /*TODO Error pg */
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
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getSelectSeat = (req, res) => {
  res.render('Bookings/seat', {
    user: req.user,
    pg: 'select_seat',
  });
};

exports.getSelectMovie = async (req, res) => {
  const id = req.params.theaterId;

  try {
    let movies = await query(
      `SELECT * from movies where m_id IN (select m_id from shows where t_id=${id});`
    );
    let mov = filterMovieData(movies);

    res.render('Bookings/select_movie', {
      pg: 'select_movie',
      user: req.user,
      movies: mov,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getSelectTime = (req, res) => {
  res.render('Bookings/select_time', {
    user: req.user,
    pg: 'select_time',
  });
};
exports.getConfirmPayment = (req, res) => {
  res.render('Bookings/confirm_payment', {
    user: req.user,
    pg: 'confirm_payment',
  });
};
