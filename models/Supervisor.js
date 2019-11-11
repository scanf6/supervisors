const { Pool, Client } = require("pg");
const User = require("./User");
const dotenv = require("dotenv");
const _ = require("lodash");
dotenv.config();

class Supervisor extends User {
  constructor(name, mail, phone, password) {
    super(name, mail, password);
    this.phone = phone;
  }

  static async getSupervisorByID(id) {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });

    const supervisor = await pool.query(
      "SELECT * FROM supervisors WHERE id=$1",
      [id]
    );
    if (supervisor.rowCount === 0) {
      return { rows: [] };
    }
    return supervisor;
  }

  static async getAllSupervisor() {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });

    const supervisors = await pool.query("SELECT * FROM supervisors");
    if (supervisors.rowCount === 0) {
      return { rows: [] };
    }
    return supervisors;
  }

  async saveSupervisor() {
    const supervisor = await this.Pool.query(
      "INSERT INTO supervisors(name,mail,phone,password) VALUES($1,$2,$3,$4) RETURNING *",
      [this.name, this.mail, this.phone, this.password]
    );

    return supervisor.rows[0];
  }

  static async assignStudents(supervisorID, students) {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });

    await pool.query("UPDATE supervisors SET students=$1 WHERE id= $2", [
      students,
      supervisorID
    ]);
  }
}

module.exports = Supervisor;
