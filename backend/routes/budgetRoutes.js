const express = require("express");
const router = express.Router();
const { setBudget, getBudgetStatus, checkBudgetAlerts } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, setBudget);
router.get("/", protect, getBudgetStatus);
router.get("/alerts", protect, checkBudgetAlerts);

module.exports = router;
