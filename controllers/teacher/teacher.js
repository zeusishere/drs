const Doubt = require("../../models/Doubt");
const Comment = require("../../models/comment");
const User = require("../../models/User");
module.exports.renderDashboard = async (req, res) => {
  try {
    // list of all tas from db
    let tas = await User.find({ "role.ta": true });
    console.log(tas);
    //  a list  of tas with data required to display
    let taList = [];

    for (let user of tas) {
      let ta = {};
      ta["userName"] = user.userName;
      ta["totalDoubtsAccepted"] = user.ta.doubtsAccepted.length;
      ta["resolvedDoubts"] = user.ta.doubtsResolved.length;
      ta["escalatedDoubts"] = user.ta.doubtsEscalated.length;
      //  total avg activity time corresponding for each ta in minutes
      ta["avgActivityTime"] =
        user.ta.doubtsResolved.reduce((t1, element) => {
          return t1 + element.avgActivityTime;
        }, 0) /
        1000 /
        60;
      console.log(ta);
      taList.push(ta);
    }
    // console.log(tas);
    let totalDoubts = await Doubt.countDocuments({});
    let resolvedDoubts = await Doubt.countDocuments({ status: "resolved" });
    let escalatedDoubts = await Doubt.countDocuments({
      hasDoubtBeenEscalated: true,
    });
    //  to get the sum of resolution time for all the reslolved doubts
    let pipeline = [
      {
        $group: {
          _id: null,
          totalResolutionTime: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$status", "resolved"],
                },
                then: { $subtract: ["$timeOfResolution", "$createdAt"] },
                else: 0,
              },
            },
          },
        },
      },
    ];
    let totalResolutionTime = await Doubt.aggregate(pipeline);
    // avgDoubtResolutionTime converted to  mins from milliseconds
    let avgDoubtResolutionTime =
      totalResolutionTime[0].totalResolutionTime / 60 / 1000 / resolvedDoubts;
    avgDoubtResolutionTime = isNaN(avgDoubtResolutionTime)
      ? 0
      : avgDoubtResolutionTime;
    console.log(
      totalDoubts,
      resolvedDoubts,
      escalatedDoubts,
      typeof avgDoubtResolutionTime,
      totalResolutionTime[0].totalResolutionTime / 60 / 1000 / resolvedDoubts
    );
    return res.render("./teacher/dashboard.ejs", {
      totalDoubts,
      resolvedDoubts,
      escalatedDoubts,
      avgDoubtResolutionTime,
      taList,
    });
  } catch (err) {
    console.log(err);
  }
};
