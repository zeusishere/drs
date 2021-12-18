const Doubt = require("../../models/Doubt");
const Comment = require("../../models/comment");

module.exports.renderStudentHome = async (req, res) => {
  try {
    let doubts = await Doubt.find({})
      .populate("author", "userName")
      .populate({
        path: "comments",
        populate: [{ path: "user", model: "User", select: "userName" }],
      })
      .populate("answeredBy", "userName")
      .sort({ createdAt: 1 });
    return res.render("./student/home.ejs", { doubts: doubts });
  } catch (err) {
    console.log(err);
  }
};
module.exports.renderCreateDoubtPage = (req, res) => {
  return res.render("./student/raiseDoubt.ejs");
};
module.exports.createDoubt = async (req, res) => {
  try {
    // simple logic to create a doubt
    let { title, description } = req.body;
    let newDoubt = await Doubt.create({
      title,
      description,
      author: req.user.id,
    });
    req.flash("success", "your Doubt has been added");
    return res.redirect("/student");
  } catch (err) {
    console.log("error while creating doubt => ", err);
    req.flash(
      "error",
      "There was a server error while trying to create the doubt"
    );

    return res.redirect("/back");
  }
};
module.exports.createACommentAndAddItToDoubt = async (req, res) => {
  try {
    let { commentText, doubtId } = req.body;
    let newComment = await Comment.create({
      commentText,
      doubt: doubtId,
      user: req.user.id,
    });
    // associatedDoubtWithNewComment refers to the doubt on which the comment will be added
    let associatedDoubtWithNewComment = await Doubt.findById(doubtId);
    associatedDoubtWithNewComment.comments.push(newComment._id);
    await associatedDoubtWithNewComment.save();
    return res.status(200).json({
      success: true,
      data: {
        comment: commentText,
        user: req.user.userName,
      },
      message: "comment added",
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: "comment could not be added",
    });
  }
};
