const { generateBudgetSuggestion } = require("../services/aiBudgetService");
const Expense = require("../models/Expense");

const getAIBudgetSuggestions = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const result = await generateBudgetSuggestion(
      req.user._id,
      currentMonth,
      currentYear
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add expense via voice/text parsing
const addExpenseFromVoice = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Simple parsing logic (can be enhanced with NLP)
    // Format: "spent 500 on food" or "500 rupees food" or "food 500"
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

    if (!amount) {
      return res.status(400).json({
        message: "Could not extract amount from text. Please include a number.",
      });
    }

    // Extract category from common keywords
    const categoryKeywords = {
      food: ["food", "restaurant", "dining", "grocery", "eat", "meal"],
      travel: ["travel", "taxi", "uber", "flight", "train", "bus"],
      shopping: ["shopping", "buy", "purchase", "store", "mall"],
      entertainment: ["movie", "cinema", "game", "entertainment", "fun"],
      utilities: ["electricity", "water", "internet", "phone", "utility"],
      rent: ["rent", "house", "apartment"],
    };

    let category = "Other";
    const lowerText = text.toLowerCase();

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        category = cat.charAt(0).toUpperCase() + cat.slice(1);
        break;
      }
    }

    // Extract title (first few words)
    const words = text.split(" ");
    const title = words.slice(0, 3).join(" ") || "Voice Expense";

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: new Date(),
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAIBudgetSuggestions, addExpenseFromVoice };
