const query = require("../util/db").query();
// Not dynamic yet since didnt knew frontend implementaion
exports.getMyReview = async (req, res) => {
  let myReviews = await query(`SELECT * FROM REVIEW WHERE p_id=1`, function (
    err,
    result
  ) {
    if (err) throw err;
    var review = JSON.stringify(result);
    console.log(review);
  });
};
exports.getParticularMovieReview = async (req, res) => {
  const movieName = req.params.movieId;
  let movie_id = await query(
    `SELECT m_id FROM MOVIES WHERE name='${movieName}';`
  );
  let movieId = movie_id[0].m_id;
  console.log("ID ", movieId);
  console.log("ID", movie_id[0].m_id);
  let movieReviews = await query(
    `SELECT * FROM REVIEW AS r WHERE r.m_id=(SELECT m.m_id FROM MOVIES AS m WHERE m.name='${movieName}');`
  );
  // console.log(movieReviews);
  if (movieReviews.length > 0) {
    // console.log("IF");
    let movie = await query(
      `SELECT * FROM MOVIES WHERE m_id=${movieReviews[0].m_id};`
    );
    let release_date = await query(
      `SELECT DATE_FORMAT(release_date,"%W %D %M %Y") as release_date from movies where m_id=${movieReviews[0].m_id};`
    );
    movie[0].release_date = release_date[0].release_date;
    //   console.log(movie);
    //   console.log(release_date[0]);

    let indx = 0;
    let result = [];
    while (indx < movieReviews.length) {
      var b = await query(
        `SELECT * FROM person where p_id=${movieReviews[indx].p_id};`
      );
      movieReviews[indx].name = b[0].name;
      indx = indx + 1;
    }
    // console.log(movieReviews);
    res.render("Flix/reviews", {
      pg: "reviews",
      user: req.user,
      review: movieReviews,
      movie: movie,
      movie_id: movieId,
    });
  } else {
    res.render("Flix/reviews", {
      pg: "reviews",
      user: req.user,
      review: movieReviews,
      movie_id: movieId,
    });
  }
};
exports.postReview = async (req, res) => {
  const movieId = req.params.movieId;
  // console.log(movieId, req.user);
  // console.log("Body", req.body);
  let description = req.body.description;
  const p_id = req.user.p_id;
  let searchPID = await query(`select p_id from review where m_id=${movieId};`);
  console.log(searchPID);
  indx = 0;
  let flag = false;
  while (indx < searchPID.length) {
    console.log(searchPID.length);
    console.log(searchPID[indx].p_id);

    if (searchPID[indx].p_id == p_id) {
      flag = true;
      break;
    }
    indx = indx + 1;
  }
  if (flag) {
    console.log("true");
    let addReview = await query(
      `update review set description="${description}" where p_id=${p_id} and m_id=${movieId};`
    );
  } else {
    console.log("false");

    let addReview = await query(`INSERT INTO REVIEW (m_id,p_id, description) values (${movieId},${p_id},
    "${description}");`);
  }
  let movieReviews = await query(
    `SELECT * FROM REVIEW AS r WHERE r.m_id=${movieId};`
  );
  // console.log(movieReviews);
  if (movieReviews.length > 0) {
    // console.log("IF");
    let movie = await query(
      `SELECT * FROM MOVIES WHERE m_id=${movieReviews[0].m_id};`
    );
    let release_date = await query(
      `SELECT DATE_FORMAT(release_date,"%W %D %M %Y") as release_date from movies where m_id=${movieReviews[0].m_id};`
    );
    movie[0].release_date = release_date[0].release_date;
    //   console.log(movie);
    //   console.log(release_date[0]);

    let indx = 0;
    let result = [];
    while (indx < movieReviews.length) {
      var b = await query(
        `SELECT * FROM person where p_id=${movieReviews[indx].p_id};`
      );
      movieReviews[indx].name = b[0].name;
      indx = indx + 1;
    }
    console.log(movieId);
    res.render("Flix/reviews", {
      pg: "reviews",
      user: req.user,
      review: movieReviews,
      movie: movie,
      movie_id: movieId,
    });
  } else {
    res.render("Flix/reviews", {
      pg: "reviews",
      user: req.user,
      review: movieReviews,
      movie_id: movieId,
    });
  }
  // res.render("Flix/reviews", {
  //   pg: "reviews",
  //   user: req.user,
  //   review: addReview,
  // });
};
