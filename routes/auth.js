const router = require("express").Router();
const {
  registerForm,
  signinForm,
  register,
  signin,
  signout,
  forgotForm,
  recoverForm,
  passwordRecovery,
  recoverPassword,
  checkIfAuthentified
} = require("../controllers/auth");

router.get("/register", checkIfAuthentified, registerForm);
router.post("/register", checkIfAuthentified, register);

router.get("/signin", checkIfAuthentified, signinForm);
router.post("/signin", checkIfAuthentified, signin);

router.get("/forgot", checkIfAuthentified, forgotForm);
router.post("/forgot", checkIfAuthentified, passwordRecovery);

router.get("/recover/:resetlink", checkIfAuthentified, recoverForm);
router.post("/recover/:resetlink", checkIfAuthentified, recoverPassword);

router.get("/signout", signout);

module.exports = router;
