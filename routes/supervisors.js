const router = require("express").Router();
const { protectAuth } = require("../controllers/auth");
const {
  listSupervisors,
  createSupervisors,
  assignStudents
} = require("../controllers/supervisors");

router.get("/", protectAuth, listSupervisors);
router.post("/", protectAuth, createSupervisors);
router.post("/assignment", protectAuth, assignStudents);

module.exports = router;
