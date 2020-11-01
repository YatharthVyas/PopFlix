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
  let movieReviews = await query(
    `SELECT * FROM REVIEW AS r WHERE r.m_id=(SELECT m.m_id FROM MOVIES AS m WHERE m.name='${movieName}');`
  );
  console.log(movieReviews);
  if (movieReviews.length > 0) {
    console.log("IF");
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
    console.log(movieReviews);
    res.render("Flix/reviews", {
      pg: "reviews",
      user: req.user,
      review: movieReviews,
      movie: movie,
    });
  } else {
    res.render("Flix/reviews", {
      pg: "reviews",
      user: req.user,
      review: movieReviews,
    });
  }
};
