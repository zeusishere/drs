const express = require("express");
const db = require("./configs/mongoose");
const app = express();
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const customMware = require("./configs/middleware");

require("dotenv").config();
let port;
const passport = require("passport");
const passportLocal = require("./configs/passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo");
let expresslayouts = require("express-ejs-layouts");
// setting up middlewares

port = parseInt(process.env.PORT);
if (port == null || port == "") {
  port = 8000;
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(require("cors")());
app.use(express.static("./public"));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expresslayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
// session middleware Setup
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_CONN,
});
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use("/", require("./routes/index"));
// flash

app.listen(port, (err) => {
  if (err) return console.log("error in setting up server ", err);
  console.log("server is running on port = ", port);
});
