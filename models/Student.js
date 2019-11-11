const { Pool, Client } = require("pg");
const User = require("./User");
const dotenv = require("dotenv");
const _ = require("lodash");
dotenv.config();

class Student extends User {
  constructor(name, mail, phone, password) {
    super(name, mail, password);
    this.phone = phone;
  }

  static async getAllStudents() {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });

    const students = await pool.query("SELECT * FROM students");
    if (students.rowCount === 0) {
      return { rows: [] };
    }
    return students;
  }

  async saveStudent() {
    const student = await this.Pool.query(
      "INSERT INTO students(name,mail,phone,password) VALUES($1,$2,$3,$4) RETURNING *",
      [this.name, this.mail, this.phone, this.password]
    );

    return student.rows[0];
  }
}

module.exports = Student;
