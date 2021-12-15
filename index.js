const express = require("express");
const db = require("./configs/mongoose");
const app = express();
let port = 8000;
let passport = require("passport");
let passportLocal = require("./configs/passport-local");
let expresslayouts = require("express-ejs-layouts");
// setting up middlewares

port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expresslayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));

app.listen(port, (err) => {
  if (err) return console.log("error in setting up server ", err);
  console.log("server is running on port = ", port);
});
