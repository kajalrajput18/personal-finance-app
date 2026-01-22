const Expense = require("../models/Expense");
const Income = require("../models/Income");

// Category mapping
const categoryTypeMap = {
  Food: "NEEDS",
  Rent: "NEEDS",
  Utilities: "NEEDS",
  Travel: "WANTS",
  Shopping: "WANTS",
  Entertainment: "WANTS",
};

const generateBudgetSuggestion = async (userId, month, year) => {
  //  Total income
  const incomeResult = await Income.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalIncome = incomeResult[0]?.total || 0;

  //  50–30–20 split
  const needsLimit = totalIncome * 0.5;
  const wantsLimit = totalIncome * 0.3;
  const savingsTarget = totalIncome * 0.2;

  //  Past expenses (last 3 months)
  const expenses = await Expense.find({ user: userId });

  let needsSpent = 0;
  let wantsSpent = 0;

  expenses.forEach((exp) => {
    const type = categoryTypeMap[exp.category];
    if (type === "NEEDS") needsSpent += exp.amount;
    if (type === "WANTS") wantsSpent += exp.amount;
  });

  //  Suggestions
  const suggestions = [];

  if (needsSpent > needsLimit) {
    suggestions.push("You are overspending on essential needs. Try reducing food or utility costs.");
  }

  if (wantsSpent > wantsLimit) {
    suggestions.push("Your discretionary spending is high. Cut down on shopping or entertainment.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Great job! Your spending follows the 50-30-20 rule.");
  }

  return {
    totalIncome,
    recommended: {
      needs: needsLimit,
      wants: wantsLimit,
      savings: savingsTarget,
    },
    actual: {
      needsSpent,
      wantsSpent,
    },
    suggestions,
  };
};

module.exports = { generateBudgetSuggestion };
