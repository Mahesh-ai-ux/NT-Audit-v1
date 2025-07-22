import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/budget.css';
import Footer from './Footer';

const API = import.meta.env.VITE_BACKEND_URL;

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
    axios.get(`${API}/api/account`).then(res => setAccounts(res.data));
    axios.get(`${API}/api/category`).then(res => setCategories(res.data));
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/budget/set`, formData);
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
        {/* your inputs here */}
        <button type="submit" className="budget-btn">Save Budget</button>
      </form>
      <Footer />
    </div>
  );
};

export default Budget;
