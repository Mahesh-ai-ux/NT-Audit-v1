// routes/budget.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Add or Update Budget
router.post('/set', async (req, res) => {
  const { accountType, category, month, year, budgetAmount } = req.body;
  try {
    const existing = await Budget.findOne({ accountType, category, month, year });
    if (existing) {
      existing.budgetAmount = budgetAmount;
      await existing.save();
      res.json({ message: 'Budget updated' });
    } else {
      const newBudget = new Budget({ accountType, category, month, year, budgetAmount });
      await newBudget.save();
      res.json({ message: 'Budget added' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

// Get Budget
router.get('/', async (req, res) => {
  const { accountType, category, month, year } = req.query;
  try {
    const budget = await Budget.findOne({ accountType, category, month, year });
    res.json(budget || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

module.exports = router;
