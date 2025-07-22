import express from 'express';
import Account from '../models/Account.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

router.post('/', async (req, res) => {
  const { accountType } = req.body;
  const newAccount = new Account({ accountType });
  await newAccount.save();
  res.json(newAccount);
});

router.put('/:id', async (req, res) => {
  const updated = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Account.findByIdAndDelete(req.params.id);
  res.json({ message: 'Account Deleted' });
});

export default router;
