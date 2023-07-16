const mysql = require("mysql");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function mysqlConnect() {
  return new Promise((resolve, reject) => {
    console.log({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    connection.connect((error) => {
      if (error) {
        reject(`Failed to establish connection with MySQL DB: ${error.stack}`);
      }

      resolve(
        `Successfully connected to MySQL DB. Connection id: ${connection.threadId}`
      );
    });
  });
}

function mysqlDisconnect() {
  return new Promise((resolve, reject) => {
    connection.end((error) => {
      if (error) {
        reject(`Failed to disconnect from MySQL DB: ${error.stack}`);
      }

      resolve(`Successfully disconnected from MySQL DB.`);
    });
  });
}

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.log(err.stack);
        reject(`Failed to execute query: ${err.stack}`);
      }
      resolve(results);
    });
  });
}

module.exports = {
  mysqlConnect,
  mysqlDisconnect,
  executeQuery,
};
