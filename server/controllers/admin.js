const query = require('../util/db').query();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const connection = require('../util/db').connection();

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
  let password = req.body.password;
  let salt = bcrypt.genSaltSync(15);
  let hash = bcrypt.hashSync(password, salt);
  try {
    connection.beginTransaction();
    let resp = await query(
      `INSERT INTO theater (name,location,rating) values ("${name}","${location}","${rating}");`
    );
    const id = resp.insertId;
    let resp2 = await query(
      `INSERT INTO theater_user (theater_id,password) values (${id},"${hash}");`
    );
    connection.commit();
  } catch (err) {
    console.log(err);
  }
  res.redirect('/admin/home');
};
exports.postMovie = async (req, res, next) => {
  let name = req.body.name;
  let release_date = req.body.release_date;
  let lang = req.body.language;
  let a_name = req.body.act_name.toString().toLowerCase();
  let actors = a_name.split(',');
  let genre = req.body.genre;
  let m_id;
  try {
    let resp = await query(
      `INSERT INTO movies (name,release_date,language) values ("${name}","${release_date}","${lang}");`
    );
    m_id = resp.insertId;
    let r = await query(
      `INSERT INTO genre (m_id,Genre) values (${m_id},"${genre}");`
    );
  } catch (err) {
    console.log(err);
  }
  for (x in actors) {
    try {
      let resp = await query(
        `SELECT EXISTS(SELECT * FROM person WHERE name LIKE '${actors[x]}' ) as present;`
      );
      if (resp[0].present == 1) {
        try {
          let id = await query(
            `SELECT p_id from person WHERE name LIKE '${actors[x]}';`
          );
          let res1 = await query(
            `INSERT INTO acted_in (p_id,m_id) values(${id[0]},${m_id});`
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          let res2 = await query(
            `INSERT INTO person (name) values("${actors[x]}");`
          );
          let id = res2.insertId;
          let res3 = await query(`INSERT INTO actor (p_id) values(${id});`);
          let res4 = await query(
            `INSERT INTO acted_in (p_id,m_id) values(${id},${m_id});`
          );
        } catch (e) {
          console.log(e);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  res.redirect('/admin/home');
};
