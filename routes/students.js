const router = require("express").Router();
const { protectAuth } = require("../controllers/auth");
const { listStudents, createStudents } = require("../controllers/students");

router.get("/", protectAuth, listStudents);
router.post("/", protectAuth, createStudents);

module.exports = router;
