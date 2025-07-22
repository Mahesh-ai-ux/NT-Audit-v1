import express from 'express';
import Income from '../models/Income.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const incomes = await Income.find();
    res.json(incomes);
});

router.post('/', async (req, res) => {
  try {
     console.log('Received data:', req.body);
    const newIncome = new Income(req.body);
    await newIncome.save();
    res.status(201).json({ message: 'Income saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save income' });
  }
});


export default router;
