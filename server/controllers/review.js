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
  let movieReviews = await query(
    `SELECT r.description FROM REVIEW AS r WHERE r.m_id=(SELECT m.m_id FROM MOVIES AS m WHERE m.name='Cheslie Lang');
        `,
    function (err, result) {
      if (err) throw err;
      var review = JSON.stringify(result);
      console.log(review);
    }
  );
};
