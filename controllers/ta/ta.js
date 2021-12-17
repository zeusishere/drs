const Doubt = require("../../models/Doubt");
const Comment = require("../../models/comment");
const User = require("../../models/User");

let checkIfDoubtIdExistsInDoubtsArr = (doubtsAccepted, doubtId) => {
  return doubtsAccepted.some((element) => {
    return element.doubt == doubtId;
  });
};
module.exports.renderTaHome = async (req, res) => {
  try {
    // console.log("global    ", global.io);

    let doubts = await Doubt.find({ status: "pending" }).sort({ createdAt: 1 });
    res.render("./ta/taHome.ejs", { doubts });
  } catch (err) {}
};
module.exports.renderDoubt = async (req, res) => {
  try {
    console.log(req.query);
    let doubtId = req.query.id;
    let doubt = await Doubt.findById(doubtId)
      .populate("author", "userName")
      .populate({
        path: "comments",
        populate: [{ path: "user", select: "userName" }],
      });
    // if doubt is already being taken by another ta
    if (
      doubt.status == "active" &&
      doubt.activeTa != null &&
      doubt.activeTa != req.user.id
    ) {
      return res.redirect("back");
    }
    doubt.status = "active";
    doubt.activeTa = req.user.id;
    doubt.save();
    console.log("Adasd");
    let activeUser = await User.findById(req.user._id);
    console.log(activeUser);
    // check if doubtId already exists in doubts accepted arr

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
  } catch (err) {
    console.log(err);
  }
};
module.exports.escalateDoubt = async (req, res) => {
  try {
    console.log(req.query);
    let doubtId = req.query.id;
    let doubt = await Doubt.findById(doubtId);

    doubt.status = "pending";
    doubt.activeTa = "null";
    doubt.hasDoubtBeenEscalated = true;
    console.log(doubt);
    // ?
    // if (!doubt.tasWhoHaveEscalatedTheDoubt.includes(req.user._id)) {
    //   doubt.tasWhoHaveEscalatedTheDoubt.push(req.user.id);
    // }
    //
    let activeUser = await User.findById(req.user._id);
    if (
      !checkIfDoubtIdExistsInDoubtsArr(activeUser.ta.doubtsEscalated, doubtId)
    ) {
      activeUser.ta.doubtsEscalated.push(doubtId);
    }
    await activeUser.save();
    await doubt.save();
    return res.redirect("/ta");
  } catch (err) {
    console.log(err);
    return res.redirect("/ta");
  }
};
// just answer doubt
module.exports.answerDoubt = async (req, res) => {
  try {
    console.log(req.query, req.body);
    let doubtId = req.query.id;
    let doubt = await Doubt.findById(doubtId);
    doubt.status = "resolved";
    doubt.activeTa = "null";
    doubt.answeredBy = req.user.id;
    doubt.answer = req.body.answer;
    doubt.timeOfResolution = new Date();
    doubt.save();

    let activeUser = await User.findById(req.user._id);
    if (
      !checkIfDoubtIdExistsInDoubtsArr(activeUser.ta.doubtsResolved, doubtId)
    ) {
      // const diffTime = Math.abs( - );
      // activeUser.ta.doubtsResolved.push({ doubtId: doubtId , avgActivityTime:1 });
    }
    activeUser.save();
    return res.redirect("/ta");
  } catch (err) {
    console.log(err);
  }
};
