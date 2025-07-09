const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "V7462881297@v",
  database: "authdb",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

module.exports = db;