const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'User',
  password: 'password',
  database: 'popflix',
});

exports.connect = () => {
  connection.connect();
};

exports.query = () => {
  return util.promisify(connection.query).bind(connection);
};