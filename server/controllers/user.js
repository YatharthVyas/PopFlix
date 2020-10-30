const bcrypt = require('bcryptjs');
const { json } = require('express');
const passport = require('passport');
const query = require('../util/db').query();

exports.getProfile = async (req, res) => {
  res.render('User/Profile', {
    pg: 'profile',
    user: req.user,
  });
};

exports.signup = async (req, res) => {
  let { name, email, psw, phone, gender } = req.body;
  let pass2 = req.body['psw-repeat'];
  if (psw !== pass2) {
    res.render('Error/error', {
      pg: 'error',
      user: req.user,
      error: 'Passwords do not match',
    });
    return;
  }
  try {
    let salt = bcrypt.genSaltSync(15);
    let hash = bcrypt.hashSync(psw, salt);
    let res = await query(
      `INSERT INTO person (name,gender) values ("${name}","${gender}");`
    );
    const id = res.insertId;
    res = await query(
      `INSERT INTO customer (p_id,Email,Phone,password) values (${id},"${email}","${phone}","${hash}");`
    );
    let user = {
      email: email,
      password: hash,
      p_id: id,
    };

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
    });
    res.redirect('/user/profile');
  } catch (e) {
    console.log(e);
    res.render('Error/error', {
      pg: 'error',
      error: 'Email already registered',
      user: req.user,
    });
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render('Error/error', {
        pg: 'error',
        user: req.user,
        error: info.message,
      });
      return;
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (user.type === 'Customer') {
        res.redirect('/user/profile');
      }
      if (user.type == 'Admin') {
        res.redirect('/admin/home');
      }
      if (user.type === 'Theater') {
        res.redirect('/flix/profile');
      }
      return;
    });
  })(req, res, next);
};
