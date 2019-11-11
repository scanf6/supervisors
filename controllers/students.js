const Students = require("../models/Student");
const Validator = require("express-validator");
exports.listStudents = async (req, res, next) => {
  const students = await Students.getAllStudents();
  return res.render("students/student_home", { students: students.rows });
};

exports.createStudents = async (req, res, next) => {
  const { name, mail, phone, password } = req.body;

  if (
    !name ||
    name.length == 0 ||
    !mail ||
    mail.length == 0 ||
    !phone ||
    phone.length == 0 ||
    !password ||
    password.length == 0
  ) {
    return res.status(500).redirect("/students/");
  }

  const student = new Students(name, mail, phone, password);
  await student.saveStudent();
  return res.redirect("/students/");
};
