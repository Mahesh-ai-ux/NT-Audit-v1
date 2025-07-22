import express from 'express';
import Transaction from '../models/Transaction.js';
import Income from '../models/Income.js'; // ✅ import your Income model

const router = express.Router();

// helper to update income balance for account
async function updateIncome(accountType, delta) {
  // find existing income entry
  const income = await Income.findOne({ accountType });
  if (income) {
    // update the amount
    income.amount = Number(income.amount) + delta;
    await income.save();
  } else {
    // if not found, create new income doc
    await Income.create({ accountType, amount: delta, date: new Date().toISOString() });
  }
}

router.post('/add-transaction', async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    // 1. Save transaction
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    const amt = Number(amount) || 0;

    // 2. Deduct from `from` account in income collection
    if (from) {
      await updateIncome(from, -amt);
    }

    // 3. Add to `to` account in income collection
    if (to) {
      await updateIncome(to, amt);
    }

    res.status(201).json({ message: 'Transaction saved and income updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save transaction or update incomes' });
  }
});

// fetch transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
