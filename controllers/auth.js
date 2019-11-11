const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
dotenv.config();

exports.registerForm = (req, res, next) => {
  res.render("auth/register");
};

exports.signinForm = (req, res, next) => {
  res.render("auth/signin");
};

exports.register = async (req, res, next) => {
  const { name, mail, password } = req.body;

  if (
    !name ||
    !mail ||
    !password ||
    (name.length === 0 || mail.length === 0 || password.length === 0)
  ) {
    return res.status(500).render("auth/register", {
      errorMessage: "Error, all the fields should be filled!"
    });
  }

  const matchUser = await User.getUser(mail);

  if (matchUser.rows[0]) {
    return res.status(500).render("auth/register", {
      errorMessage: "User already exists!"
    });
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  const user = new User(name, mail, hash);
  await user.saveUser();
  res.status(200).render("auth/signin", {
    successMessage: "Successfully Registered. Login to access the Dashboard!"
  });
};

exports.signin = async (req, res, next) => {
  const { mail, password } = req.body;
  if (!mail || !password || (mail.length === 0 || password.length === 0)) {
    return res.status(500).render("auth/signin", {
      errorMessage: "Error, all the fields should be filled!"
    });
  }
  const user = await User.getUser(mail);

  if (!user.rows[0]) {
    return res.render("auth/signin", { errorMessage: "User not Found!" });
  } else {
    const passMatch = await bcrypt.compare(password, user.rows[0].password);
    if (passMatch) {
      res.cookie("auth", true);
      req.app.locals.authentified = true;
      return res.render("home");
    } else {
      return res.render("auth/signin", {
        errorMessage: "Incorrect Mail or Password!"
      });
    }
  }
};

exports.signout = (req, res, next) => {
  res.clearCookie("auth");
  req.app.locals.authentified = false;
  return res.redirect("/");
};

exports.forgotForm = (req, res, next) => {
  return res.render("auth/forgot");
};
exports.recoverForm = (req, res, next) => {
  return res.render("auth/recover", { resetlink: req.params.resetlink });
};

exports.passwordRecovery = async (req, res, next) => {
  const { mail } = req.body;
  if (!mail || mail.length === 0) {
    return res
      .status(500)
      .render("auth/forgot", { errorMessage: "Please fill all fields!" });
  }
  const user = await User.getUser(mail);
  if (!user.rows[0]) {
    return res.status(500).render("auth/forgot", {
      errorMessage: "This user does not exists!"
    });
  }
  const resetID = await bcrypt.hash(mail, 10);
  const resetlink = resetID.split("/").join("_");
  const recoverUrl = encodeURI(
    "http://localhost:5000/auth/recover/" + resetlink
  );

  await User.updateUser("mail", mail, { resetlink: resetlink });
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  const msg = {
    to: mail,
    from: "scanf555@gmail.com",
    subject: "Password Recovery!",
    text: "Please follow the instructions to recover your password",
    html:
      "<strong>Please follow the instructions to recover your password, Click on the following link:<a href=" +
      recoverUrl +
      ">Reset Password</a></strong>"
  };
  sgMail.send(msg);
  return res.render("auth/signin", {
    successMessage: "Please check your mail to reset your password!"
  });
};

exports.recoverPassword = async (req, res, next) => {
  const { resetlink } = req.params;
  const { password, confpassword } = req.body;
  if (password !== confpassword) {
    return res.status(500).render("auth/recover", {
      errorMessage: "Password are not identical",
      resetlink
    });
  }
  const hash = await bcrypt.hash(password, 10);

  const user = await User.getUserByColumn("resetlink", resetlink);
  if (user.rows[0]) {
    await User.updateUser("resetlink", resetlink, {
      password: hash,
      resetlink: null
    });
    return res.status(200).redirect("/auth/signin");
  } else {
    return res.status(500).redirect("/");
  }
};

exports.checkIfAuthentified = (req, res, next) => {
  const { auth } = req.cookies;
  if (auth) {
    return res.redirect("/");
  }
  return next();
};

exports.protectAuth = (req, res, next) => {
  if (req.cookies.auth) {
    req.app.locals.authentified = true;
    return next();
  } else {
    return res.redirect("/auth/register");
  }
};
