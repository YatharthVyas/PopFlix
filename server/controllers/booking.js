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
    console.log(theaters);
    return res.render("Bookings/flix", {
      pg: "book_flix",

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
    res.render("Bookings/movie", {
      pg: "book_movie",

      movies: mov,
    });
  } catch (err) {
    console.log(err);
    /*TODO Error pg */
  }
};

exports.getSelectFlix = async (req, res) => {
  const id = req.params.movieId;
  console.log("MovieId", id);
  try {
    let theater = await query(`SELECT * FROM theater WHERE t_id IN (select t_id from shows where m_id=${id})
	  ;`);
    // let theater = await query(`SELECT * FROM
    //   movies m INNER JOIN shows s
    // 	  ON m.m_id = s.m_id
    //   INNER JOIN theater t
    // 	  ON t.t_id=s.t_id
    //   WHERE m.m_id = ${id}
    //   ;`);
    res.render("Bookings/select_flix", {
      pg: "select_flix",
      theater: theater,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getSelectSeat = (req, res) => {
  res.render("Bookings/seat", {
    pg: "select_seat",
  });
};

exports.getSelectMovie = async (req, res) => {
  const id = req.params.theaterId;

  console.log(id, "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");

  try {
    let movies = await query(
      `SELECT * from movies where m_id IN (select m_id from shows where t_id=${id});`
    );
    let mov = filterMovieData(movies);

    res.render("Bookings/select_movie", {
      pg: "select_movie",

      movies: mov,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.getSelectTime = (req, res) => {
  res.render("Bookings/select_time", {
    pg: "select_time",
  });
};
exports.getConfirmPayment = (req, res) => {
  res.render("Bookings/confirm_payment", {
    pg: "confirm_payment",
  });
};
