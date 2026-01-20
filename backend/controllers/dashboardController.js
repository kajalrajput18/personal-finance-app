const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Budget = require("../models/Budget");

const getDashboardStats = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 1️ Total Income
    const incomeResult = await Income.aggregate([
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

    const totalIncome = incomeResult[0]?.total || 0;

    // 2️ Total Expense
    const expenseResult = await Expense.aggregate([
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

    const totalExpense = expenseResult[0]?.total || 0;

    // 3️ Savings
    const savings = totalIncome - totalExpense;

    // 4️ Category-wise Expense
    const categoryExpenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    // 5️ Fetch budgets
    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    });

    // 6️ Merge alerts into category-wise data
    const categoryWise = categoryExpenses.map((item) => {
      const budget = budgets.find(
        (b) => b.category === item._id
      );

      let alertLevel = "NO_BUDGET";
      let percentageUsed = 0;

      if (budget) {
        percentageUsed = Math.round(
          (item.totalSpent / budget.limit) * 100
        );

        if (percentageUsed >= 100) alertLevel = "EXCEEDED";
        else if (percentageUsed >= 90) alertLevel = "CRITICAL";
        else if (percentageUsed >= 70) alertLevel = "WARNING";
        else alertLevel = "SAFE";
      }

      return {
        category: item._id,
        spent: item.totalSpent,
        budgetLimit: budget?.limit || null,
        percentageUsed,
        alertLevel,
      };
    });

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

module.exports = { getDashboardStats };
