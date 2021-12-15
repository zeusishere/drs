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
        let userFromDB = await User.findOne({ email });
        if (!userFromDB) {
          return done(null, false);
        }
        let isPasswordValid = validPassword(passport, user.hash, user.salt);
        if (isPasswordValid) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
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
