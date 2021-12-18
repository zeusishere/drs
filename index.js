const express = require("express");
const db = require("./configs/mongoose");
const app = express();
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const customMware = require("./configs/middleware");
// socket.io code
// const http = require("http");
// const socketPort = 3000;
// const server = http.createServer();
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:8000",
//     methods: ["GET", "POST"],
//   },
// });

//  // to be setup later as an added feature to show realtime notifications to students and tas .
// io.on("connection", (socket) => {
//   console.log("New websocket connection");
//   socket.on("disconnect", () => {
//     console.log("New websocket disconnected");
//   });
// });
// server.listen(socketPort);
// global.io = io;
// socket .io code end
require("dotenv").config();
let port = 8000;
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
// setting socket.io code here
// session middleware Setup
console.log("FSDfsffffffffffffffffffffff", typeof process.env.PORT);
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
