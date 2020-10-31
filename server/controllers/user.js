const bcrypt = require("bcryptjs");
const passport = require("passport");
const query = require("../util/db").query();
const connection = require("../util/db").connection();

exports.getProfile = async (req, res) => {
  let p_id = req.user.p_id;
  try {
    let person = await query(`SELECT * from person where p_id=${p_id};`);
    const user = req.user;
    let names = person[0].name.toString().split(" ");
    user.fname = names[0];

    if (names.length > 1) user.lname = names[1];
    else user.lname = " ";
    if (person.gender == "M") user.gender = "Male";
    else if (person.gender == "F") user.gender = "Female";
    else user.gender = "Other";
    res.render("User/Profile", {
      pg: "profile",
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signup = async (req, res, next) => {
  let { name, email, psw, phone, gender } = req.body;
  let pass2 = req.body["psw-repeat"];
  if (psw !== pass2) {
    res.render("Error/error", {
      pg: "error",
      user: req.user,
      error: "Passwords do not match",
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
      req.user.type = "Customer";

      return res.redirect("/user/profile");
    });
  } catch (e) {
    connection.rollback();
    res.render("Error/error", {
      pg: "error",
      error: "Email or Phone already registered",
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
    res.redirect("/user/profile");
  } catch (error) {
    console.log(error);
  }
};
exports.login = async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render("Error/error", {
        pg: "error",
        user: req.user,
        error: info.message,
      });
      return;
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (user.type === "Customer") {
        res.redirect("/user/profile");
      }
      if (user.type == "Admin") {
        res.redirect("/admin/home");
      }
      if (user.type === "Theater") {
        res.redirect("/flix/profile");
      }
      return;
    });
  })(req, res, next);
};
