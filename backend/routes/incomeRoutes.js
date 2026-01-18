const express = require("express");
const router = express.Router();
const {
  addIncome,
  getIncome,
  deleteIncome,
} = require("../controllers/incomeController");

const {protect} = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", addIncome);
router.get("/", getIncome);
router.delete("/:id", deleteIncome);

module.exports = router;
