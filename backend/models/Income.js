import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  accountType: String,
  category: String,
  amount: Number,
  notes: String,
  photo: String,
  date: Date,
});

const Income = mongoose.model('Income', incomeSchema);
export default Income;