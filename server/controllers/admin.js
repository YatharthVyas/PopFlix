const query = require('../util/db').query();
exports.getAdmin = (req, res, next) => {
  res.render('Auth/admin', {
    pg: 'admin',
    user: req.user,
  });
};
exports.postTheater = async (req, res, next) => {
  let name = req.body.name;
  let location = req.body.location;
  let rating = req.body.rating;
  try {
    let resp = await query(
      `INSERT INTO theater (name,location,rating) values ("${name}","${location}","${rating}");`
    );

    console.log(resp);
  } catch (err) {
    console.log(err);
  }
  res.redirect('/admin/home');
};
exports.postMovie = async (req, res, next) => {
  let name = req.body.name;
  let release_date = req.body.release_date;
  let lang = req.body.language;
  try {
    let resp = await query(
      `INSERT INTO movies (name,release_date,language) values ("${name}","${release_date}","${lang}");`
    );

    console.log(resp);
  } catch (err) {
    console.log(err);
  }
  res.redirect('/admin/home');
};
