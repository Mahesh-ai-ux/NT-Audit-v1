import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  accountType: String,
  category: String,
  amount: Number,
  notes: String,
  photo: String,
  date: String
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
