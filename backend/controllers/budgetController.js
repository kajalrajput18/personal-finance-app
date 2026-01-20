const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// 1️⃣ Set or Update Budget
const setBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { limit },
      { new: true, upsert: true }
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Budget Status (limit vs spent)
const getBudgetStatus = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    });

    const result = [];

    for (let budget of budgets) {
      const expenseSum = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
            category: budget.category,
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

      const spent = expenseSum[0]?.total || 0;

      result.push({
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining: budget.limit - spent,
        percentageUsed: Math.round((spent / budget.limit) * 100),
        alert: spent > budget.limit,
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Auto Alert Levels
const checkBudgetAlerts = async (req, res) => {
  const { month, year } = req.query;

  const budgets = await Budget.find({
    user: req.user._id,
    month,
    year,
  });

  const results = [];

  for (let budget of budgets) {
    const expenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          category: budget.category,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    const spent = expenses[0]?.totalSpent || 0;
    const percentUsed = (spent / budget.limit) * 100;

    let alert = "SAFE";
    if (percentUsed >= 100) alert = "EXCEEDED";
    else if (percentUsed >= 90) alert = "CRITICAL";
    else if (percentUsed >= 70) alert = "WARNING";

    results.push({
      category: budget.category,
      limit: budget.limit,
      spent,
      percentUsed: percentUsed.toFixed(2),
      alert,
    });
  }

  res.json(results);
};

module.exports = {
  setBudget,
  getBudgetStatus,
  checkBudgetAlerts,
};
