const Supervisors = require("../models/Supervisor");
const Students = require("../models/Student");
const Validator = require("express-validator");

exports.listSupervisors = async (req, res, next) => {
  const supervisors = await Supervisors.getAllSupervisor();
  const students = await Students.getAllStudents();
  return res.render("supervisors/supervisor_home", {
    supervisors: supervisors.rows,
    students: students.rows
  });
};

exports.createSupervisors = async (req, res, next) => {
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
    return res.status(500).redirect("/supervisors/");
  }

  const supervisor = new Supervisors(name, mail, phone, password);
  await supervisor.saveSupervisor();
  return res.redirect("/supervisors/");
};

exports.assignStudents = async (req, res, next) => {
  const { supervisor, students } = req.body;
  await Supervisors.assignStudents(supervisor, students);
  return res.redirect("/supervisors/");
};
