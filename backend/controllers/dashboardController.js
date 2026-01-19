const Expense = require("../models/Expense");
const Income = require("../models/Income");

exports.getDashboardStats = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    //  Total Expense
    const expenseTotal = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    //  Total Income
    const incomeTotal = await Income.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    //  Category-wise Expense
    const categoryWise = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalExpense = expenseTotal[0]?.total || 0;
    const totalIncome = incomeTotal[0]?.total || 0;
    const savings = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      savings,
      categoryWise,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
