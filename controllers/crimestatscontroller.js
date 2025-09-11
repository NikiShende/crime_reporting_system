const Crime = require("../models/crime");

// 1. Group crimes by category
const getCrimeCategoryStats = async (req, res) => {
  try {
    const stats = await Crime.aggregate([
      {
        $group: {
          _id: "$category", // group by category field
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          crime_type: "$_id", // rename _id -> crime_type
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category stats", error });
  }
};

// 2. Group crimes by month
const getCrimeMonthlyStats = async (req, res) => {
  try {
    const stats = await Crime.aggregate([
      {
        $group: {
          _id: { $month: "$dateReported" }, // extract month from dateReported
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              [
                "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              "$_id"
            ]
          },
          count: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } } // sort by month order
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly stats", error });
  }
};

module.exports = { getCrimeCategoryStats, getCrimeMonthlyStats };
