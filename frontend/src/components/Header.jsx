import React, { useState, useEffect } from 'react'
import '../style/navbar.css';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Calendar } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/log.png';

const Header = () => {
     const navigate = useNavigate();
      const [showSidebar, setShowSidebar] = useState(false);
    
      const [incomes, setIncomes] = useState([]);
      const [expenses, setExpenses] = useState([]);
    
      const [incomeTotal, setIncometotal] = useState(0);
      const [expenseTotal, setExpensetotal] = useState(0);
      const [balance, setBalanceTotal] = useState(0);

      const toggleSidebar = () => setShowSidebar(!showSidebar);
      const handleAccountClick = () => navigate('/account');
      const handleCategoryClick = () => navigate('/category');
      
       useEffect(() => {
          fetchData();
        }, []);
      
        const fetchData = async () => {
          try {
            const incomeRes = await axios.get('http://localhost:5000/api/income');
            const expenseRes = await axios.get('http://localhost:5000/api/expense');
            setIncomes(incomeRes.data);
            setExpenses(expenseRes.data);
             // Totals calculated only once from all data  navbar page
            const incomeSum = incomeRes.data.reduce((sum, item) => sum + Number(item.amount), 0);
            const expenseSum = expenseRes.data.reduce((sum, item) => sum + Number(item.amount), 0);
            setIncometotal(incomeSum);
            setExpensetotal(expenseSum);
            setBalanceTotal(incomeSum - expenseSum);
          } catch (err) {
            console.error('Failed to fetch data:', err);
          }
        };
        const formatAmount = (amount) => parseFloat(amount).toFixed(2);
      
  return (
   <div className="tracker-container">
       
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <button onClick={() => setShowSidebar(false)} className="close-btn">×</button>
        <button className="category-btn" onClick={handleAccountClick}>Account</button>
        <button className="category-btn" onClick={handleCategoryClick}>Category</button>
      </div>

      {/* Header */}
      <div className='header-container'>
        <div className="header">
          <Menu className="icon" onClick={toggleSidebar} />
          <img src={logoImg} alt="Logo" className="logo-image" />
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Search transactions..." />
            <Search className="icon-small search-icon" />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs fixed-tabs">
          <button className="tab">Today</button>
          <button className="tab" >Weekly</button>
          <button className="tab" >Monthly</button>
          <button className="tab"><Calendar className="icon-small" /> Calendar</button>
        </div>

        
        {/* Summary - now styled vertically */}
        <div className="table-header fixed-table">
          <div className="summary-item">
            <span>Income</span>
            <span className='incometol'>₹{formatAmount(incomeTotal)}</span>
          </div>
          <div className="summary-item">
            <span>Expense</span>
            <span className='expensetol'>-₹{formatAmount(expenseTotal)}</span>
          </div>
          <div className="summary-item">
            <span>Balance</span>
            <span className='balancetol'>₹{formatAmount(balance)}</span>
          </div>
        
      </div>
      </div>
    </div>
  )
}

export default Header
