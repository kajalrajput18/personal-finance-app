const Expense = require("../models/Expense");

//  Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const expense = await Expense.create({
      user: req.user._id,
      ...rest,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get expenses month-wise
exports.getExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
