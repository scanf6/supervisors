const { Pool, Client } = require("pg");
const dotenv = require("dotenv");
const _ = require("lodash");
dotenv.config();

class User {
  constructor(name, mail, password) {
    this.name = name;
    this.mail = mail;
    this.password = password;

    this.Pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });
  }

  async saveUser() {
    const user = await this.Pool.query(
      "INSERT INTO users(name,mail,password) VALUES($1,$2,$3) RETURNING *",
      [this.name, this.mail, this.password]
    );

    return user.rows[0];
  }

  static async getUser(mail) {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });
    const user = await pool.query("SELECT * FROM users WHERE mail=$1", [mail]);
    if (!user) {
      return null;
    }
    return user;
  }

  static async getUserByColumn(columnName, columnValue) {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });
    const user = await pool.query(
      "SELECT * FROM users WHERE " + columnName + "=$1",
      [columnValue]
    );
    if (!user) {
      return null;
    }
    return user;
  }

  static async updateUser(columnName, columnValue, infos) {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });
    const user = await pool.query(
      "SELECT * FROM users WHERE " + columnName + "=$1",
      [columnValue]
    );

    const updatedUser = _.merge(user.rows[0], infos);

    await pool.query(
      "UPDATE users SET name = $1,mail = $2,password = $3, resetlink=$4 WHERE " +
        columnName +
        "= $5",
      [
        updatedUser.name,
        updatedUser.mail,
        updatedUser.password,
        updatedUser.resetlink,
        columnValue
      ]
    );
  }
}

module.exports = User;
