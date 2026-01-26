const Expense = require("../models/Expense");
const Income = require("../models/Income");

// Category mapping
const categoryTypeMap = {
  Food: "NEEDS",
  Rent: "NEEDS",
  Utilities: "NEEDS",
  General: "NEEDS",
  Travel: "WANTS",
  Shopping: "WANTS",
  Entertainment: "WANTS",
  Other: "WANTS",
};

const generateBudgetSuggestion = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  //  Total income for the month
  const incomeResult = await Income.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalIncome = incomeResult[0]?.total || 0;

  //  50–30–20 split
  const needsLimit = totalIncome * 0.5;
  const wantsLimit = totalIncome * 0.3;
  const savingsTarget = totalIncome * 0.2;

  //  Expenses for the month
  const expenses = await Expense.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  let needsSpent = 0;
  let wantsSpent = 0;
  const categorySpending = {};

  expenses.forEach((exp) => {
    const type = categoryTypeMap[exp.category] || "WANTS";
    if (type === "NEEDS") needsSpent += exp.amount;
    if (type === "WANTS") wantsSpent += exp.amount;

    categorySpending[exp.category] =
      (categorySpending[exp.category] || 0) + exp.amount;
  });

  const totalSpent = needsSpent + wantsSpent;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

  // Determine Spending Personality
  let personality = "Balanced Spender";
  let personalityDescription = "You maintain a good balance between needs and wants.";

  if (needsSpent > needsLimit * 1.2) {
    personality = "Essential Focused";
    personalityDescription =
      "You prioritize essential needs, which is great for financial security. Consider allocating some funds for enjoyment.";
  } else if (wantsSpent > wantsLimit * 1.2) {
    personality = "Lifestyle Enthusiast";
    personalityDescription =
      "You enjoy spending on lifestyle and entertainment. Try to balance this with savings goals.";
  } else if (savingsRate >= 20) {
    personality = "Savings Champion";
    personalityDescription =
      "Excellent! You're saving more than 20% of your income. Keep up the great work!";
  } else if (savingsRate < 0) {
    personality = "Overspender";
    personalityDescription =
      "You're spending more than you earn. Focus on reducing expenses and increasing income.";
  } else if (savingsRate < 10) {
    personality = "Minimal Saver";
    personalityDescription =
      "You're saving less than 10% of your income. Try to increase your savings rate gradually.";
  }

  //  Budget Suggestions
  const suggestions = [];

  if (needsSpent > needsLimit) {
    suggestions.push({
      type: "warning",
      message: `You're spending ₹${(needsSpent - needsLimit).toFixed(2)} more on needs than recommended. Review your essential expenses.`,
    });
  } else {
    suggestions.push({
      type: "success",
      message: `Great! Your needs spending (₹${needsSpent.toFixed(2)}) is within the recommended limit.`,
    });
  }

  if (wantsSpent > wantsLimit) {
    suggestions.push({
      type: "warning",
      message: `Your discretionary spending is ₹${(wantsSpent - wantsLimit).toFixed(2)} over budget. Consider cutting back on non-essentials.`,
    });
  } else {
    suggestions.push({
      type: "success",
      message: `Well done! Your wants spending is within budget.`,
    });
  }

  if (savingsRate < 20 && totalIncome > 0) {
    suggestions.push({
      type: "info",
      message: `Aim to save at least 20% of your income. Currently saving ${savingsRate.toFixed(1)}%.`,
    });
  }

  // Personalized Tips
  const tips = [];

  const topCategory = Object.entries(categorySpending).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (topCategory) {
    const categoryPercentage = (topCategory[1] / totalSpent) * 100;
    if (categoryPercentage > 40) {
      tips.push(
        `You spend ${categoryPercentage.toFixed(1)}% of your budget on ${topCategory[0]}. Consider diversifying your spending.`
      );
    }
  }

  if (expenses.length > 0) {
    const avgExpense = totalSpent / expenses.length;
    if (avgExpense > 1000) {
      tips.push(
        `Your average expense per transaction is ₹${avgExpense.toFixed(2)}. Look for opportunities to reduce transaction sizes.`
      );
    }
  }

  if (savingsRate < 0) {
    tips.push(
      "You're spending more than you earn. Create a strict budget and track every expense."
    );
    tips.push(
      "Consider finding ways to increase your income or reduce recurring expenses."
    );
  } else if (savingsRate >= 20) {
    tips.push(
      "Excellent savings rate! Consider investing your savings to grow your wealth."
    );
  } else {
    tips.push(
      "Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings. Adjust based on your goals."
    );
    tips.push(
      "Review your expenses weekly to identify patterns and areas for improvement."
    );
  }

  if (Object.keys(categorySpending).length < 3) {
    tips.push(
      "You have limited spending categories. Diversifying can help identify optimization opportunities."
    );
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
      totalSpent,
      savingsRate,
    },
    personality: {
      type: personality,
      description: personalityDescription,
    },
    suggestions,
    tips,
    categorySpending,
  };
};

module.exports = { generateBudgetSuggestion };
