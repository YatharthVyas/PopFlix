const LocalStrategy = require('passport-local').Strategy;
const mysql = require('../util/db.js');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      let user = await mysql.query()(
        `SELECT * FROM customer WHERE email = "${username}";`
      );
      if (user.length == 0) {
        return done(null, false, {
          message: 'No User with given Username is Found',
        });
      }

      // Match Password
      bcrypt.compare(password, user[0].password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Incorrect Password',
          });
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      let u = mysql.query()(`SELECT * FROM customer WHERE p_id = ${id};`);
      done(null, user);
    } catch (e) {
      done(e, null);
    }
  });
};
