const User = require("../models/User");
const { genPassword } = require("../utilties/password-utils");

module.exports.createSession = async (req, res) => {};
module.exports.createUser = async (req, res) => {
  try {
    let { email, userName, password, role } = req.body;
    console.log(req.body);
    let user = await User.findOne({ email });
    let roleOption = { [role]: true };
    if (user) {
      // need to show error ab front end
      return res.redirect("back");
    } else {
      let { salt, hash } = genPassword(req.body.password);
      let newUser = await User.create({
        email,
        userName,
        role: roleOption,
        password: { salt, hash },
      });
      return res.redirect(`/`);
    }
  } catch (err) {
    console.log(err);
  }

  //   return res.send(req.body);
};
