// models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  accountType: String,
  category: String,
  month: Number,
  year: Number,
  budgetAmount: Number,
});

module.exports = mongoose.model('Budget', budgetSchema);
