const { generateBudgetSuggestion } = require("../services/aiBudgetService");

const getAIBudgetSuggestions = async (req, res) => {
  try {
    const { month, year } = req.query;

    const result = await generateBudgetSuggestion(
      req.user._id,
      month,
      year
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAIBudgetSuggestions };
