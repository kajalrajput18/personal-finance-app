const Income = require("../models/Income");

//  Add income
exports.addIncome = async (req, res) => {
  try {
    const { date, ...rest } = req.body;
    const income = await Income.create({
      user: req.user._id,
      ...rest,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get income month-wise
exports.getIncome = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const income = await Income.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete income
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
