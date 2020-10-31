const query = require("../util/db").query();

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
    return res.render("Bookings/flix", {
      pg: "book_flix",
      user: req.user,
      theaters: theaters,
      dropRegions: dropRegions,
    });
  } catch (err) {
    console.log("Error", err);
    /*TODO Error pg */
  }
};

exports.searchFlix = async (req, res) => {
  try {
    const theaterName = req.body.searchmovie;
    const theaterLocation = req.body.region;
    let dropRegions = await query(`SELECT Location FROM theater;`);

    let theaters = {};
    if (req.body.region == "Region") {
      theaters = await query(
        `SELECT * FROM theater WHERE name LIKE '%${theaterName}%';`
      );
    } else if (req.body.searchmovie == "") {
      theaters = await query(
        `SELECT * FROM theater AS t WHERE LOCATION='${theaterLocation}' GROUP BY t.LOCATION ORDER BY t.rating;`
      );
    } else {
      theaters = await query(
        `SELECT * FROM theater AS t WHERE name LIKE '%${theaterName}%' AND t.LOCATION='${theaterLocation}' GROUP BY t.LOCATION ORDER BY t.rating;`
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

    return res.render("Bookings/flix", {
      pg: "book_flix",
      user: req.user,
      theaters: theaters,
      dropRegions: dropRegions,
    });
  } catch (err) {
    console.log(err);
  }
};

const filterMovieData = (movies) => {
  let indx = 0;
  while (indx < movies.length) {
    let ar = movies[indx].release_date.toString().split(" ");
    let r_date = ar[0] + " " + ar[1] + " " + ar[2] + " " + ar[3];
    movies[indx].release_date = r_date;
    let x = movies[indx].language;
    let y = "Marathi";
    if (x == "EN") y = "English";
    else if (x == "Hi") y = "Hindi";
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
    let dropLanguage = await query(`SELECT DISTINCT LANGUAGE FROM MOVIES;`);
    let dropGenre = await query(`SELECT DISTINCT Genre FROM Genre;`);
    let indx = 0;
    while (indx < dropLanguage.length) {
      let x = dropLanguage[indx].LANGUAGE;
      if (x == "EN") dropLanguage[indx].LANGUAGE = "English";
      else if (x == "Hi") dropLanguage[indx].LANGUAGE = "Hindi";
      else dropLanguage[indx].LANGUAGE = "Marathi";
      indx = indx + 1;
    }

    res.render("Bookings/movie", {
      pg: "book_movie",
      user: req.user,
      movies: mov,
      dropLanguage: dropLanguage,
      dropGenre: dropGenre,
    });
  } catch (err) {
    console.log(err);
    /*TODO Error pg */
  }
};

exports.searchMovie = async (req, res) => {
  try {
    let movieName = req.body.searchMovie;
    let language = req.body.lang;
    let genre = req.body.genre;
    let dropLanguage = await query(`SELECT DISTINCT LANGUAGE FROM MOVIES;`);
    let dropGenre = await query(`SELECT DISTINCT Genre FROM Genre;`);
    let indx = 0;
    while (indx < dropLanguage.length) {
      let x = dropLanguage[indx].LANGUAGE;
      if (x == "EN") dropLanguage[indx].LANGUAGE = "English";
      else if (x == "Hi") dropLanguage[indx].LANGUAGE = "Hindi";
      else dropLanguage[indx].LANGUAGE = "Marathi";
      indx = indx + 1;
    }

    let mov = {};
    if (language == "Language" && genre == "Genre") {
      mov = await query(
        `SELECT * FROM MOVIES WHERE name LIKE '%${movieName}%';`
      );
    } else if (movieName == "" && genre == "Genre") {
      if (language == "English") language = "EN";
      else if (language == "Hindi") language = "Hi";
      else language = "Ma";
      mov = await query(`SELECT * FROM MOVIES WHERE language='${language}';`);
    } else if (movieName == "" && language == "Language") {
      mov = await query(
        `SELECT * FROM MOVIES AS m WHERE m.m_id IN (SELECT m_id from genre where GENRE='${genre}');`
      );
    } else if (genre == "Genre") {
      if (language == "English") language = "EN";
      else if (language == "Hindi") language = "Hi";
      else language = "Ma";
      mov = await query(
        `SELECT * FROM MOVIES WHERE name LIKE '%${movieName}%' AND language='${language}';`
      );
    } else if (movieName == "") {
      if (language == "English") language = "EN";
      else if (language == "Hindi") language = "Hi";
      else language = "Ma";
      mov = await query(
        `SELECT * FROM MOVIES AS m WHERE m.language='${language}' AND m.m_id IN (SELECT m_id from genre where GENRE='${genre}');`
      );
    } else if (language == "Language") {
      mov = await query(
        `SELECT * FROM MOVIES AS m WHERE m.name LIKE '%${movieName}%' AND m.m_id IN (SELECT m_id from genre where GENRE='${genre}');`
      );
    } else {
      if (language == "English") language = "EN";
      else if (language == "Hindi") language = "Hi";
      else language = "Ma";
      mov = await query(
        `SELECT * FROM MOVIES AS m WHERE m.name LIKE '%${movieName}%' AND m.language='${language}' AND m.m_id IN (SELECT m_id from genre where GENRE='${genre}');`
      );
    }

    mov = filterMovieData(mov);

    res.render("Bookings/movie", {
      pg: "book_movie",
      user: req.user,
      movies: mov,
      dropLanguage: dropLanguage,
      dropGenre: dropGenre,
    });
  } catch (err) {
    console.log(err);
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
    res.render("Bookings/select_flix", {
      user: req.user,
      pg: "select_flix",
      theater: theater,
      movieId: id,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getSelectSeat = async (req, res) => {
  let { date, show_id } = req.query;
  let seats = await query(
    `select * from seats where theater_id=(select t_id from shows where show_id=${show_id}) order by s_id ASC`
  );

  let base_cost = await query(
    `select CASE WHEN WEEKDAY(${date}) IN (5,6) THEN s.price+s.weekend_price ELSE s.price END AS cost from shows s where show_id=${show_id}`
  );
  const base = seats[0].s_id;
  for (seat in seats) {
    seats[seat].s_id = seats[seat].s_id - base + 1;
  }
  let booked = await query(
    `select seat_id from ticket where show_id=${show_id} and dt=${date}`
  );
  res.render("Bookings/seat", {
    user: req.user,
    pg: "select_seat",
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

    res.render("Bookings/select_movie", {
      pg: "select_movie",
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
    res.render("Bookings/select_time", {
      user: req.user,
      pg: "select_time",
      shows: shows,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getConfirmPayment = (req, res) => {
  res.render("Bookings/confirm_payment", {
    user: req.user,
    pg: "confirm_payment",
  });
};
