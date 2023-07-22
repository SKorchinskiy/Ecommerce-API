require("dotenv").config();

module.exports = {
  development: {
    client: "mysql",
    connection: {
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
