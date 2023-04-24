const dotenv = require('dotenv');

dotenv.config();

const conf = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "next_db",
    host: "127.0.0.1",
    port: 8889,
    dialect: "mysql",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "next_db",
    host: "127.0.0.1",
    port: 8889,
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "next_db",
    host: "127.0.0.1",
    port: 8889,
    dialect: "mysql"
  }
}

module.exports = conf;