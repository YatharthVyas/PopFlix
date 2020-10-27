const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tejas@18',
  database: 'popflix',
});

exports.connect = () => {
  connection.connect();
};

exports.query = () => {
  return util.promisify(connection.query).bind(connection);
};
