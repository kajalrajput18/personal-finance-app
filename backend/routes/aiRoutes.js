const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAIBudgetSuggestions,
  addExpenseFromVoice,
} = require("../controllers/aiController");

router.get("/budget-suggestions", protect, getAIBudgetSuggestions);
router.post("/voice-expense", protect, addExpenseFromVoice);

module.exports = router;
