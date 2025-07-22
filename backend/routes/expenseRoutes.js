import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
});

router.post('/add-expense', async (req, res) => {
  try {
     console.log('Received data:', req.body);
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json({ message: 'expense saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

export default router;