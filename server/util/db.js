const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vatsal13@13",
  database: "popflix",
});

exports.connect = () => {
  connection.connect();
};

exports.connection = () => {
  return connection;
};

exports.query = () => {
  return util.promisify(connection.query).bind(connection);
};
