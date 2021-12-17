const User = require("../models/User");
const passport = require("passport");
const { validPassword, genPassword } = require("../utilties/password-utils");
const localStrategy = require("passport-local").Strategy;
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        let { role } = req.body;

        let userFromDB = await User.findOne({ email });
        // console.log(role, userFromDB.role[role]);
        if (!userFromDB || !userFromDB.role[role]) {
          return done(null, false);
        }
        let isPasswordValid = validPassword(
          password,
          userFromDB.password.hash,
          userFromDB.password.salt
        );
        if (isPasswordValid) {
          return done(null, userFromDB);
        }
        return done(null, false);
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);
// fns below handle putting/extracting user info to and from express sessions
// serialize user stores user id into session store
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
// deserializeUser retrieves the usedId from the session and use it to find it into the database
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
});
//  middlewares to check authentication
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("useer is authenticated")
    return next();
  }
  console.log("authentication FAILED ");
  return res.redirect("/user/signin");
};
passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
passport.authorizedStudent = (req, res, next) => {
  if (req.isAuthenticated() && res.locals.user.role.student) {
    return next();
  }
  console.log("you are not registered as a student");
  return res.end("you are not autherized to view this page");
};
passport.authorizedTa = (req, res, next) => {
  console.log("res.locals.user.role.ta ", res.locals.user.role.ta);

  if (req.isAuthenticated() && res.locals.user.role.ta) {
    return next();
  }
  console.log("you are not registered as a ta");
  return res.end("you are not autherized to view this page");
};
passport.authorizedTeacher = (req, res, next) => {
  if (req.isAuthenticated() && res.locals.user.role.teacher) {
    return next();
  }
  console.log("you are not registered as a teacher");
  return res.end("you are not autherized to view this page");
};
module.exports = passport;
