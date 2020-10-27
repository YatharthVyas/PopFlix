const mysql = require("mysql");
const express = require("express");
const path = require("path");
const flixroutes = require("./routes/flix");
const userroutes = require("./routes/user");

// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'Tejas@18',
//   database : 'popflix'
// });

const app = express();
// connection.connect();

// connection.query('SELECT * FROM theater', function (error, results, fields) {
//   if (error) throw error;
//   console.table(results);
// });

// connection.end();

app.set("view engine", "ejs");
app.set("views", "views");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/flix", flixroutes);
app.use("/user", userroutes);

app.listen(3000, () => {
  console.log("Hello");
});
