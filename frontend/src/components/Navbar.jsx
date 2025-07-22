import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Calendar as CalendarIcon, Plus, List, BarChart2, Wallet, Briefcase, DollarSign } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/navbar.css';
import logoImg from '../assets/log.png';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [filter, setFilter] = useState('weekly'); // default to weekly
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarButtonRef = useRef(null);
  const calendarRef = useRef(null);

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);

  const handleAddClick = () => navigate('/add-expense');
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const handleAccountClick = () => navigate('/account');
  const handleCategoryClick = () => navigate('/category');
  const handleAnalysisClick = () => navigate('/analysis');
  const handleAccountsClick = () => navigate('/accounts');
  const handleNavbarClick = () => navigate('/navbar');
  const handleBudgetClick= () => { navigate('/budget')};
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const incomeRes = await axios.get('http://localhost:5000/api/income');
      const expenseRes = await axios.get('http://localhost:5000/api/expense');
      setIncomes(incomeRes.data);
      setExpenses(expenseRes.data);
      const incomeSum = incomeRes.data.reduce((sum, item) => sum + Number(item.amount), 0);
      const expenseSum = expenseRes.data.reduce((sum, item) => sum + Number(item.amount), 0);
      setIncomeTotal(incomeSum);
      setExpenseTotal(expenseSum);
      setBalance(incomeSum - expenseSum);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Filter helpers
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const isThisWeek = (date) => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const d = new Date(date);
    return d >= weekStart && d <= weekEnd;
  };

  const isThisMonth = (date) => {
    const d = new Date(date);
    const today = new Date();
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const getFilteredData = (data) => {
    if (selectedDate) {
      return data.filter((item) => new Date(item.date).toDateString() === selectedDate.toDateString());
    }
    switch (filter) {
      case 'today':
        return data.filter((item) => isToday(item.date));
      case 'weekly':
        return data.filter((item) => isThisWeek(item.date));
      case 'monthly':
        return data.filter((item) => isThisMonth(item.date));
      default:
        return data;
    }
  };

  const mergedTransactions = [
    ...getFilteredData(incomes).map(i => ({ ...i, type: 'income' })),
    ...getFilteredData(expenses).map(e => ({ ...e, type: 'expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const groupedByDate = mergedTransactions.reduce((acc, item) => {
    const dateKey = new Date(item.date).toLocaleDateString();
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  // responsive calendar placement
  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target) && !calendarButtonRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="header-container">
        <div className="header">
          <Menu className="icon" onClick={toggleSidebar} />
          <img src={logoImg} alt="Logo" className="logo-image" />
          <div className="search-container">
            <input type="text" placeholder="Search transactions..." className="search-input" />
            <Search className="icon-small search-icon" />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs fixed-tabs">
          <button className={`tab ${filter === 'today' ? 'active-tab' : ''}`} onClick={() => { setFilter('today'); setSelectedDate(null); }}>Today</button>
          <button className={`tab ${filter === 'weekly' ? 'active-tab' : ''}`} onClick={() => { setFilter('weekly'); setSelectedDate(null); }}>Weekly</button>
          <button className={`tab ${filter === 'monthly' ? 'active-tab' : ''}`} onClick={() => { setFilter('monthly'); setSelectedDate(null); }}>Monthly</button>
          <button
            className={`tab ${selectedDate ? 'active-tab' : ''}`}
            onClick={() => setShowCalendar(!showCalendar)}
            ref={calendarButtonRef}
          >
            <CalendarIcon className="icon-small" /> Calendar
          </button>

          {showCalendar && (
            <div
              className="calendar-dropdown"
              ref={calendarRef}
               style={{
                position: "absolute",
                top: calendarButtonRef.current
                ? calendarButtonRef.current.offsetTop +
                calendarButtonRef.current.offsetHeight +
                4
                : 0,
                left: 0,
                right: 0,
                margin: "0 auto",
                maxWidth: "320px",
                 }}
            >
              <Calendar
                onChange={(date) => {
                  setSelectedDate(date);
                  setFilter(null);
                  setShowCalendar(false);
                }}
                value={selectedDate}
                next2Label={null}
                prev2Label={null}
                
              />
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="table-header fixed-table">
          <div className="summary-item">
            <span>Income</span>
            <span className="incometol">₹{formatAmount(incomeTotal)}</span>
          </div>
          <div className="summary-item">
            <span>Expense</span>
            <span className="expensetol">-₹{formatAmount(expenseTotal)}</span>
          </div>
          <div className="summary-item">
            <span>Balance</span>
            <span className="balancetol">₹{formatAmount(balance)}</span>
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="records-container">
        {Object.keys(groupedByDate).length > 0 ? (
          Object.keys(groupedByDate).map(date => (
            <div key={date} className="record-date-group">
              <h3 className="date-header">{date}</h3>
              {groupedByDate[date].map(item => (
                <div key={item._id} className={`record-item-${item.type}`}>
                  <span className="account">{item.accountType}</span>
                  <span className="category">{item.category}</span>
                  <span className="amount">
                    {item.type === 'income' ? '₹' : '-₹'}{formatAmount(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <div onClick={handleNavbarClick}><List className="bottom-icon" /> Transaction</div>
        <div onClick={handleAnalysisClick}><BarChart2 className="bottom-icon" /> Analysis</div>
        <div onClick={handleAccountsClick}><Wallet className="bottom-icon" /> Account</div>
        <div><Briefcase className="bottom-icon" /> Business</div>
        <div onClick={handleBudgetClick}><DollarSign className="bottom-icon" /> Budget</div>
      </div>

      {/* FAB */}
      <button className="fab-button" onClick={handleAddClick}>
        <Plus className="fab-icon" />
      </button>
    </div>
  );
};

export default Navbar;
