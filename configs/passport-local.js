const User = require("../models/User");
const passport = require("passport");
const { validPassword, genPassword } = require("../utilties/password-utils");
const localStrategy = require("passport-local").Strategy;
// configuring local strategy
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        // role refers to user type, which is one of the following Student , teacher , ta
        let { role } = req.body;

        let userFromDB = await User.findOne({ email });
        // if userFromDb is null ie user does not exist in db  or role from req does not match with the role in db
        if (!userFromDB || !userFromDB.role[role]) {
          req.flash("error", "Invalid Login Credentials. Please Try Again !!");
          return done(null, false);
        }
        let isPasswordValid = validPassword(
          password,
          userFromDB.password.hash,
          userFromDB.password.salt
        );
        // if password mathes the one used in db
        if (isPasswordValid) {
          userFromDB.currentlyLoggedInAs = role;
          await userFromDB.save();
          return done(null, userFromDB);
        }
        return done(null, false);
      } catch (err) {
        console.log(err);
        req.flash(
          "error",
          "There was an Internal server error while trying to log-in"
        );
        done(err);
      }
    }
  )
);
// fns below handle putting/extracting user info to and from express sessions in dB
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
  res.status(401);
  return res.redirect("/user/signin");
};
// to have access to user while using templating engine
passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
// below are user-roles or user type specific  authorization checking middlewares
passport.authorizedStudent = (req, res, next) => {
  if (req.isAuthenticated() && res.locals.user.role.student) {
    return next();
  }
  console.log("you are not registered as a student");
  res.status(403);
  return res.end("you are not autherized to view this page");
};
passport.authorizedTa = (req, res, next) => {
  console.log("res.locals.user.role.ta ");

  if (req.isAuthenticated() && res.locals.user.role.ta) {
    return next();
  }
  console.log("you are not registered as a ta");
  res.status(403);
  return res.end("you are not autherized to view this page");
};
passport.authorizedTeacher = (req, res, next) => {
  if (req.isAuthenticated() && res.locals.user.role.teacher) {
    return next();
  }
  console.log("you are not registered as a teacher");
  res.status(403);
  return res.end("you are not autherized to view this page");
};
module.exports = passport;
