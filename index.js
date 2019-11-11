const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
var helpers = require("handlebars-helpers")();
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const studentsRouter = require("./routes/students");
const supervisorsRouter = require("./routes/supervisors");
const { protectAuth } = require("./controllers/auth");
dotenv.config();

const app = express();
const hbs = exphbs.create({
  helpers: helpers
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
//======General Middlewares=============
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/node_modules/"));
//======================================
app.use("/auth", authRouter);
app.use("/students", studentsRouter);
app.use("/supervisors", supervisorsRouter);
app.get("/", protectAuth, (req, res, next) => {
  return res.render("home");
});
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
