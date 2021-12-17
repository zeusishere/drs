const Doubt = require("../../models/Doubt");
const Comment = require("../../models/comment");
const User = require("../../models/User");
module.exports.renderDashboard = async (req, res) => {
  try {
    let pipeline = [
      {
        $group: {
          _id: "$answeredBy",
          totalDoubts: { $sum: 1 },
          resolvedDoubts: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$status", "resolved"],
                },
                then: 1,
                else: 0,
              },
            },
          },
          escalatedDoubts: {
            $sum: {
              $cond: {
                if: {
                  $in: ["$answeredBy", ["$tasWhoHaveEscalatedTheDoubt"]],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "ta",
        },
      },
      { $unwind: "$ta" },
    ];
    let results = await Doubt.aggregate(pipeline);

    //   {
    //     $project: {
    //       _id: "$ta",
    //       userName: 1,
    //     },
    //   },
    //     { "$unwind": "$accounts" },
    //   { "$project": {
    //     "_id": "$accounts",
    //     "total": 1,
    //     "lineItems": 1
    //   }}
    // let results = await Doubt.aggregate()
    //   .group({ _id: "$answeredBy" })
    //   .lookup({
    //     from: "users",
    //     localField: "_id",
    //     foreignField: "_id",
    //     as: "user",
    //   })
    //   .unwind("userName");

    console.log(results);
    return res.send("teacher homepagefsdf");
  } catch (err) {
    console.log(err);
  }
};
