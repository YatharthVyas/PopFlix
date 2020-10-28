const LocalStrategy = require('passport-local').Strategy;
const mysql = require('../util/db.js');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        let user = await mysql.query()(
          `SELECT * FROM customer WHERE email = "${username}";`
        );
        if (user.length == 0) {
          return done(null, false, {
            message: 'No User with given email is Found',
          });
        }
        if (bcrypt.compareSync(password, user[0].password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Incorrect Password',
          });
        }
      } catch (e) {
        throw e;
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function (user, done) {
    try {
      let u = mysql.query()(
        `SELECT * FROM customer WHERE p_id = ${user[0].p_id};`
      );
      done(null, u);
    } catch (e) {
      done(e, null);
    }
  });
};
