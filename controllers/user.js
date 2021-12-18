const User = require("../models/User");
const { genPassword } = require("../utilties/password-utils");
let student = "student",
  teacher = "teacher",
  teachingAssistant = "ta";
module.exports.createSession = async (req, res) => {
  console.log("req.body", req.body);
  // when user logs in
  let role = req.body.role;
  req.flash("success", "logged in Successfully");
  switch (role) {
    case teacher:
      return res.redirect(`/${teacher}`);
      break;
    case teachingAssistant:
      return res.redirect(`/${teachingAssistant}`);
    default:
      return res.redirect(`/${student}`);
  }
};
module.exports.redirectUserToSpecificHomePage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/sign-in");
  }
  let userFromDb = await User.findById(req.user._id);
  let role = userFromDb.currentlyLoggedInAs;
  switch (role) {
    case teacher:
      return res.redirect(`/${teacher}`);
      break;
    case teachingAssistant:
      return res.redirect(`/${teachingAssistant}`);
    default:
      return res.redirect(`/${student}`);
  }
};

module.exports.createUser = async (req, res) => {
  try {
    let { email, userName, password, role } = req.body;
    console.log(req.body);
    let user = await User.findOne({ email });
    let roleOption = { [role]: true };
    if (user) {
      // need to show error ab front end
      req.flash("error", "user already exists , please log-in to continue");
      return res.redirect("/sign-in");
    } else {
      let { salt, hash } = genPassword(req.body.password);
      let newUser = await User.create({
        email,
        userName,
        role: roleOption,
        password: { salt, hash },
      });
      req.flash(
        "success",
        "you have succesfully signed up. Please login to Continue"
      );

      return res.redirect(`/sign-in`);
    }
  } catch (err) {
    console.log(err);
  }

  //   return res.send(req.body);
};
module.exports.logout = function (req, res) {
  req.logout();
  req.flash("success", "you have logged out");

  return res.redirect("/sign-in");
};
