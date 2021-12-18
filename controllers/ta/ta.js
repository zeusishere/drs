const Doubt = require("../../models/Doubt");
const Comment = require("../../models/comment");
const User = require("../../models/User");
const taUtilFns = require("../../utilties/ta-utils");
//  helper fn to check if the doubt id is present in array
let checkIfDoubtIdExistsInDoubtsArr = taUtilFns.checkIfDoubtIdExistsInDoubtsArr;
module.exports.renderTaHome = async (req, res) => {
  try {
    let doubts = await Doubt.find({ status: "pending" }).sort({ createdAt: 1 });
    res.render("./ta/taHome.ejs", { doubts });
  } catch (err) {
    console.log(err);
    req.flash(
      "error",
      "There was an Internal server error . Please reload the page . "
    );
  }
};
module.exports.renderDoubt = async (req, res) => {
  try {
    let doubtId = req.query.id;
    let doubt = await Doubt.findById(doubtId)
      .populate("author", "userName")
      .populate({
        path: "comments",
        populate: [{ path: "user", select: "userName" }],
      });
    // to check if doubt is already resolved
    if (doubt.status === "resolved") {
      req.flash(
        "error",
        "sorry the doubt has already been answered by another Ta .Please select another doubt"
      );
      return res.redirect("back");
    }
    // if doubt has already been taken by another ta , rediect to ta home
    if (
      doubt.status == "active" &&
      doubt.activeTa != null &&
      doubt.activeTa != req.user.id
    ) {
      req.flash(
        "error",
        "sorry the doubt has already been taken by another Ta .Pleas select another doubt"
      );
      return res.redirect("back");
    }
    // continue down if doubt is pending
    doubt.status = "active";
    doubt.activeTa = req.user.id;
    doubt.timeOfDoubtAcceptal = new Date();
    doubt.save();

    let activeUser = await User.findById(req.user._id);
    // check if doubtId already exists in doubts accepted array of current

    if (
      !checkIfDoubtIdExistsInDoubtsArr(activeUser.ta.doubtsAccepted, doubtId)
    ) {
      activeUser.ta.doubtsAccepted.push({
        doubt: doubtId,
        doubtAcceptalTime: new Date(),
      });
    }
    await activeUser.save();

    return res.render("./ta/viewDoubt.ejs", { doubt: doubt });
  } catch (err) {}
};
module.exports.escalateDoubt = async (req, res) => {
  try {
    let doubtId = req.query.id;
    let doubt = await Doubt.findById(doubtId);
    doubt.status = "pending";
    doubt.activeTa = "null";
    doubt.timeOfDoubtAcceptal = null;
    doubt.hasDoubtBeenEscalated = true;
    let activeUser = await User.findById(req.user._id);
    // the root of error is here
    if (
      !activeUser.ta.doubtsEscalated.some((element) => {
        return doubtId == element;
      })
    ) {
      activeUser.ta.doubtsEscalated.push(doubtId);
    }
    await activeUser.save();
    await doubt.save();
    req.flash("success", "You have escalated the doubt");
    return res.redirect("/ta");
  } catch (err) {
    return res.redirect("/ta");
  }
};
module.exports.answerDoubt = async (req, res) => {
  try {
    let doubtId = req.query.id;
    let doubt = await Doubt.findById(doubtId);
    doubt.status = "resolved";
    doubt.activeTa = "null";
    doubt.answeredBy = req.user.id;
    doubt.answer = req.body.answer;
    doubt.timeOfResolution = new Date();
    doubt.save();
    //  need to save the resolved doubt with ta model (inside ta.doubtsResolved)
    // just a routine check to prevent same doubt being added twice due to reload etc
    let activeUser = await User.findById(req.user._id);
    if (
      !checkIfDoubtIdExistsInDoubtsArr(activeUser.ta.doubtsResolved, doubtId)
    ) {
      // calculates activity time of doubt in milliseconds
      const diffTime = Math.abs(
        doubt.timeOfResolution - doubt.timeOfDoubtAcceptal
      );
      // save avgActivityTime along with doubt
      activeUser.ta.doubtsResolved.push({
        doubt: doubtId,
        avgActivityTime: diffTime,
      });
    }
    activeUser.save();
    req.flash("success", "You have successfully answered the doubt");
    return res.redirect("/ta");
  } catch (err) {
    console.log(err);
  }
};
