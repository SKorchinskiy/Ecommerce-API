const mysql = require("mysql");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

function mysqlConnect() {
  connection.connect((error) => {
    if (error) {
      console.error(
        `Failed to establish connection with MySQL DB: ${error.stack}`
      );
    }

    console.log(
      `Successfully connected to MySQL DB. Connection id: ${connection.threadId}`
    );
  });
}

function mysqlDisconnect() {
  connection.end();
}

module.exports = {
  mysqlConnect,
  mysqlDisconnect,
};
