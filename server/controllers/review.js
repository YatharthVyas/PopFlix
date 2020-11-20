const query = require('../util/db').query();
// Not dynamic yet since didnt knew frontend implementaion
exports.getMyReview = async (req, res) => {
  let myReviews = await query(`SELECT * FROM review WHERE p_id=1`, function (
    err,
    result
  ) {
    if (err) throw err;
    var review = JSON.stringify(result);
  });
};
exports.getParticularMovieReview = async (req, res) => {
  const movieName = req.params.movieId;
  let movie_id = await query(
    `SELECT m_id FROM movies WHERE name='${movieName}';`
  );
  let movieId = movie_id[0].m_id;

  let movieReviews = await query(
    `SELECT * FROM review AS r WHERE r.m_id=(SELECT m.m_id FROM movies AS m WHERE m.name='${movieName}');`
  );

  if (movieReviews.length > 0) {
    let movie = await query(
      `SELECT * FROM movies WHERE m_id=${movieReviews[0].m_id};`
    );
    let release_date = await query(
      `SELECT DATE_FORMAT(release_date,"%W %D %M %Y") as release_date from movies where m_id=${movieReviews[0].m_id};`
    );
    movie[0].release_date = release_date[0].release_date;

    let indx = 0;
    let result = [];
    while (indx < movieReviews.length) {
      var b = await query(
        `SELECT * FROM person where p_id=${movieReviews[indx].p_id};`
      );
      movieReviews[indx].name = b[0].name;
      indx = indx + 1;
    }
    try {
      let actors = await query(
        `SELECT name FROM person where p_id IN (Select p_id from acted_in where m_id=${movieId});`
      );
      movie.actors = actors;
    } catch (error) {
      console.log(error);
    }
    res.render('Flix/reviews', {
      pg: 'reviews',
      user: req.user,
      review: movieReviews,
      movie: movie,
      movie_id: movieId,
    });
  } else {
    res.render('Flix/reviews', {
      pg: 'reviews',
      user: req.user,
      review: movieReviews,
      movie_id: movieId,
    });
  }
};
exports.postReview = async (req, res) => {
  try
  {
   const movieId = req.params.movieId;

  let description = req.body.description;
  const p_id = req.user.p_id;
  let searchPID = await query(`select p_id from review where m_id=${movieId};`);

  indx = 0;
  let flag = false;
  while (indx < searchPID.length) {
    if (searchPID[indx].p_id == p_id) {
      flag = true;
      break;
    }
    indx = indx + 1;
  }
  if (flag) {
    let addReview = await query(
      `update review set description="${description}" where p_id=${p_id} and m_id=${movieId};`
    );
  } else {
    let addReview = await query(`INSERT INTO review (m_id,p_id, description) values (${movieId},${p_id},
    "${description}");`);
  }
  let movieReviews = await query(
    `SELECT * FROM review AS r WHERE r.m_id=${movieId};`
  );

  if (movieReviews.length > 0) {
    let movie = await query(
      `SELECT * FROM movies WHERE m_id=${movieReviews[0].m_id};`
    );
    let release_date = await query(
      `SELECT DATE_FORMAT(release_date,"%W %D %M %Y") as release_date from movies where m_id=${movieReviews[0].m_id};`
    );
    movie[0].release_date = release_date[0].release_date;

    let indx = 0;
    let result = [];
    while (indx < movieReviews.length) {
      var b = await query(
        `SELECT * FROM person where p_id=${movieReviews[indx].p_id};`
      );
      movieReviews[indx].name = b[0].name;
      indx = indx + 1;
    }
    try {
      let actors = await query(
        `SELECT name FROM person where p_id IN (Select p_id from acted_in where m_id=${movieId});`
      );
      movie.actors = actors;
    } catch (error) {
      console.log(error);
    }

    res.render('Flix/reviews', {
      pg: 'reviews',
      user: req.user,
      review: movieReviews,
      movie: movie,
      movie_id: movieId,
    });
  } else {
    res.render('Flix/reviews', {
      pg: 'reviews',
      user: req.user,
      review: movieReviews,
      movie_id: movieId,
    });
  }
  }
  catch(e){
    console.log(e);
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Error Occured',
    });
  }
  // res.render("Flix/reviews", {
  //   pg: "reviews",
  //   user: req.user,
  //   review: addReview,
  // });
};
