const LocalStrategy = require('passport-local').Strategy;
const mysql = require('../util/db.js').query();
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        let user = await mysql(
          `SELECT * FROM customer WHERE email = "${username}";`
        );
        if (user.length == 0) {
          let theater = await mysql(
            `SELECT * FROM theater_user WHERE theater_id = ${username}`
          );
          if (theater.length == 0) {
            return done(null, false, {
              message: 'No User with given credential is Found',
            });
          } else {
            user = theater;
            user[0].type = 'Theater';
          }
        } else {
          user[0].type = 'Customer';

          if (user[0].Email === 'admin') {
            user[0].type = 'Admin';
          }
        }
        if (bcrypt.compareSync(password, user[0].password)) {
          return done(null, user[0]);
        } else {
          return done(null, false, {
            message: 'Incorrect Password',
          });
        }
      } catch (e) {
        console.log(e);
        return done(null, false, {
          message: 'No User with given credential is Found',
        });
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function (user, done) {
    try {
      // let u;
      // if (user.type === 'Customer' || user.type === 'Admin') {
      //   u = await mysql(`SELECT * FROM customer WHERE p_id = ${user.p_id};`);
      // } else {
      //   u = await mysql(
      //     `SELECT * FROM theater_user WHERE theater_id = ${user.theater_id};`
      //   );
      // }
      // u[0].type = user.type;
      done(null, user);
    } catch (e) {
      done(e, null);
    }
  });
};
