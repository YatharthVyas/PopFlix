const query = require("../util/db").query();
exports.getHome = (req, res, next) => {
  res.render("Auth/home", {
    pg: "home",
    user: req.user,
  });
};
exports.getAboutUs = (req, res, next) => {
  res.render("Auth/aboutus", {
    pg: "aboutus",
    user: req.user,
  });
};
exports.postAddShow = async (req, res, next) => {
  const m_id = req.body.m_id;
  const time = req.body.time;
  const price = req.body.price;
  const w_price = req.body.w_price;
  const t_id = req.body.t_id;
  let response = await query(
    `INSERT INTO shows (slot,price,weekend_price,m_id,t_id) values ("${time}","${price}","${
      w_price - price
    }",${m_id},1)`
  );
  res.redirect("/flix/profile");
};
exports.postDeleteShow = async (req, res, next) => {
  console.log(req.params);
  const m_id = req.params.movieId;
  // const time = req.body.time;
  // const price = req.body.price;
  // const w_price = req.body.w_price;
  // const t_id = req.body.t_id;
  let response = await query(`DELETE FROM SHOWS WHERE m_id=${m_id};`);
  res.redirect("/flix/profile");
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
exports.getFlixProfile = async (req, res, next) => {
  try {
    let movies = await query(
      `SELECT name,m_id FROM movies WHERE release_date < CURDATE() ORDER BY release_date DESC LIMIT 15;`
    );
    let mov = await query(
      `SELECT * from movies where m_id IN (select m_id from shows where t_id=${req.user.theater_id});`
    );
    let theater_movies = filterMovieData(mov);
    res.render("Flix/flix_profile", {
      pg: "profile",
      user: req.user,
      movies: movies,
      theater_movies: theater_movies,
    });
  } catch (err) {
    console.log(err);

    res.render("Error/error", {
      pg: "error",
      user: req.user,
      error: "Some Error Occurred",
    });
    /*TODO Error pg */
  }
};
