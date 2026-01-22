const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getAIBudgetSuggestions } = require("../controllers/aiController");

router.get("/budget-suggestions", protect, getAIBudgetSuggestions);

module.exports = router;
