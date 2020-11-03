const bcrypt = require('bcryptjs');
const passport = require('passport');
const query = require('../util/db').query();
const connection = require('../util/db').connection();

exports.getProfile = async (req, res) => {
  let p_id = req.user.p_id;
  try {
    let person = await query(`SELECT * from person where p_id=${p_id};`);
    const user = req.user;
    let names = person[0].name.toString().split(' ');
    user.fname = names[0];

    if (names.length > 1) user.lname = names[1];
    else user.lname = ' ';
    if (person[0].gender == 'M') user.gender = 'Male';
    else if (person[0].gender == 'F') user.gender = 'Female';
    else user.gender = 'Other';

    //Tickets
    let ticket = await query(
      `select * from ticket t inner join payment p on t.payment_id = p.payment_id  where t.payment_id in (select payment_id from payment where c_id=${p_id})   order by p.timeAndDateofPurchase desc;`
    );

    let indx = 0;
    while (indx < ticket.length) {
      let a = await query(
        `SELECT * FROM payment AS p where p.payment_id=${ticket[indx].payment_id};`
      );
      let b = await query(
        `SELECT seat_id from booking where payment=${ticket[indx].payment_id};`
      );

      let c = await query(
        `SELECT location,name,t_id from theater where t_id=(select s.t_id from shows as s where s.show_id=${ticket[indx].show_id});`
      );

      let d = await query(
        `SELECT name from movies where m_id=(select distinct s.m_id from shows as s where s.show_id=${ticket[indx].show_id});`
      );

      ticket[indx].location = c[0].location;
      ticket[indx].theaterName = c[0].name;
      ticket[indx].movieName = d[0].name;
      indx1 = 0;
      let seats = [];
      res1 = await query(
        `select s_id from seats where theater_id=${c[0].t_id} order by s_id limit 1;`
      );
      const base_id = res1[0].s_id;

      while (indx1 < b.length) {
        seats[indx1] = b[indx1].seat_id;

        indx1 = indx1 + 1;
      }
      ticket[indx].seats_id = seats
        .toString()
        .split(',')
        .map((id) => {
          return Number(id);
        })
        .map((id) => {
          return id - base_id + 1;
        })
        .join(',');

      ticket[indx].timeAndDateOfPurchase = new Date(
        a[0].timeAndDateOfPurchase
      ).toDateString();
      ticket[indx].amount = a[0].amount;
      indx = indx + 1;
    }
    res.render('User/Profile', {
      pg: 'profile',
      user: user,
      ticket: ticket,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signup = async (req, res, next) => {
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
    connection.beginTransaction();
    let res1 = await query(
      `INSERT INTO person (name,gender) values ("${name}","${gender}");`
    );
    const id = res1.insertId;

    res1 = await query(
      `INSERT INTO customer (p_id,Email,Phone,password) values (${id},"${email}","${phone}","${hash}");`
    );
    let user = {
      email: email,
      password: hash,
      p_id: id,
    };
    connection.commit();

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.user.type = 'Customer';

      return res.redirect('/user/profile');
    });
  } catch (e) {
    console.log(e);
    connection.rollback();
    res.render('Error/error', {
      pg: 'error',
      error: 'Email or Phone already registered',
      user: req.user,
    });
  }
};

exports.updateProf = async (req, res, next) => {
  let p_id = req.user.p_id;
  try {
    let resp = await query(
      `UPDATE customer SET Email="${req.body.email}",Phone="${req.body.phone}" WHERE p_id=${p_id};`
    );
    res.redirect('/user/profile');
  } catch (error) {
    console.log(error);
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

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
