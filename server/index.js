const mysql = require('mysql');
const express = require('express');
const path = require('path');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'Username',
  password : 'Password',
  database : 'popflix'
});


const app = express();

connection.connect();

connection.query('SELECT * FROM theater', function (error, results, fields) {
  if (error) throw error;
  console.table(results);
});
 
connection.end();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(5000,()=>{
    console.log("Hello");
})