import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  notes: String,
  date: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;