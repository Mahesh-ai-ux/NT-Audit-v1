// Budget.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/budget.css'; // Ensure you create this for styles
import Footer from './Footer';

const Budget = () => {
  const [formData, setFormData] = useState({
    accountType: '',
    category: '',
    budgetAmount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/account').then(res => setAccounts(res.data));
    axios.get('http://localhost:5000/api/category').then(res => setCategories(res.data));
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/budget/set', formData);
      alert("✅ Budget saved successfully!");
      setFormData({
        accountType: '',
        category: '',
        budgetAmount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } catch {
      alert("❌ Failed to save budget.");
    }
  };

  return (
    <div className="budget-container">
      <h2>📝 Set Budget</h2>
      <form onSubmit={handleSubmit} className="budget-form">

        <div className="form-group">
          <label>Account Type</label>
          <select name="accountType" value={formData.accountType} onChange={handleChange} required>
            <option value="">Select Account</option>
            {accounts.map(a => <option key={a._id} value={a.accountType}>{a.accountType}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c.categoryType}>{c.categoryType}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Budget Amount</label>
          <input type="number" name="budgetAmount" value={formData.budgetAmount} onChange={handleChange} placeholder="Enter amount" required />
        </div>

        <div className="form-group">
          <label>Month</label>
          <select name="month" value={formData.month} onChange={handleChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            max="2099"
          />
        </div>

        <button type="submit" className="budget-btn">Save Budget</button>
      </form>
      <Footer />
    </div>
  );
};

export default Budget;
