import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/log.png';
import { Menu, Search, Calendar,Plus, List, BarChart2, Wallet, Briefcase, DollarSign } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import '../style/analysis.css';
import '../style/navbar.css';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const Analysis = () => {
const navigate = useNavigate();
{/*analysis page state*/}
  const [type, setType] = useState('income');
  const [view, setView] = useState('weekly');
  const [currentCategoryData, setCurrentCategoryData] = useState([]);
  const [pastCategoryData, setPastCategoryData] = useState([]);

  const COLORS =(str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit int
  }

  // Use hash to create HSL values
  const hue = Math.abs(hash) % 360; // 0–359
  const saturation = 70; // keep high saturation
  const lightness = 50; // middle lightness for visibility on dark/light
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
{/*navbar page state*/}

  const [showSidebar, setShowSidebar] = useState(false);

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [incomeTotal, setIncometotal] = useState(0);
  const [expenseTotal, setExpensetotal] = useState(0);
  const [balance, setBalanceTotal] = useState(0);
const [filter, setFilter] = useState('all');

  {/*Navaigate page*/}
  const handleAnalysisClick = () => {navigate('/analysis');};
  const handleNavbarClick = () => navigate('/navbar');
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const handleAccountClick = () => navigate('/account');
  const handleCategoryClick = () => navigate('/category');
  const handleAddClick = () => navigate('/add-expense');
  const handleAccountsClick= () => { navigate('/accounts')};
  const handleBudgetClick= () => { navigate('/budget')};

  useEffect(() => {
    fetchCategoryData();
  }, [type, view]);

  const fetchCategoryData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/${type}`);
      const data = res.data;

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);

      const filterByRange = (items, fromDate, toDate = now) => {
        return items.filter(item => {
          const date = new Date(item.date);
          return date >= fromDate && date < toDate;
        });
      };

      const groupByCategory = (items) => {
        const map = {};
        let total = 0;
        items.forEach(({ category, amount }) => {
          total += Number(amount);
          map[category] = (map[category] || 0) + Number(amount);
        });
        return Object.entries(map).map(([category, amount], index) => ({
          name: category,
          value: Number(amount.toFixed(2)),
          percentage: total > 0 ? ((amount / total) * 100).toFixed(2) : '0.00',
          color: COLORS(category)
        }));
      };

      let currentFiltered = [], pastFiltered = [];
      if (view === 'daily') {
        currentFiltered = data.filter(item => new Date(item.date).toDateString() === now.toDateString());
        pastFiltered = data.filter(item => new Date(item.date).toDateString() === yesterday.toDateString());
      }
      else if (view === 'weekly') {
        currentFiltered = filterByRange(data, oneWeekAgo);
        pastFiltered = filterByRange(data, twoWeeksAgo, lastWeek);
      } else if (view === 'monthly') {
        const currentMonth = now.getMonth();
        const lastMonth = (currentMonth - 1 + 12) % 12;
        currentFiltered = data.filter(item => new Date(item.date).getMonth() === currentMonth);
        pastFiltered = data.filter(item => new Date(item.date).getMonth() === lastMonth);
      }  else if (view === 'yearly') {
        const currentYear = now.getFullYear();
        currentFiltered = data.filter(item => new Date(item.date).getFullYear() === currentYear);
      }

      setCurrentCategoryData(groupByCategory(currentFiltered));
      setPastCategoryData(groupByCategory(pastFiltered));

      {/*navbar page get the date for this page*/}
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
      console.error('Error fetching category data:', err);
    }
  };

  const renderCategoryList = (data) => (
    <ul className="category-list">
      {data.map((item, index) => (
        <li key={index} className="category-item">
          <span className="color-box" style={{ backgroundColor: item.color }}></span>
          <span className="category-name">{item.name}</span>
          <span className="category-amount">₹{item.value.toFixed(2)}</span>
          <span className="category-percent">({item.percentage}%)</span>
        </li>
      ))}
    </ul>
  );
//pie chart without percentage inside donut chart
const isMobile = window.innerWidth <= 480;
  const renderChartSection = (title, data) => (
    <div className="chart-section">
      <h3 className="category-title">{title}</h3>
      <div className="chart-list-row">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"  
                  innerRadius={isMobile ? 30 : 60}
                  outerRadius={isMobile ? 60 : 100}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="list-container">
          {renderCategoryList(data)}
        </div>
      </div>
    </div>
  );
// const isMobile = window.innerWidth <= 480;
//   const renderChartSection = (title, data) => (
//     <div className="chart-section">
//       <h3 className="category-title">{title}</h3>
//       {data.length === 0 ? (
//         <p className="no-data">No data available for this {title.toLowerCase()}.</p>
//       ) : (
//         <div className="chart-list-row">
//           <div className="chart-container">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={data}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                    innerRadius={isMobile ? 30 : 60}
//                   outerRadius={isMobile ? 60 : 100}
//                   label={({ name, percentage }) => `${percentage}%`}
//                 >
//                   {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value, name, props) => [`₹${value.toFixed(2)}`, name]} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="list-container">
//             {renderCategoryList(data)}
//           </div>
//         </div>
//       )}
//     </div>
//   );

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
              <button className="tab" onClick={() => setView('daily')} id={view === 'daily' ? 'active' : ''}>Today</button>
              <button className="tab" onClick={() => setView('weekly')} id={view === 'weekly' ? 'active' : ''}>Weekly</button>
              <button className="tab" onClick={() => setView('monthly')} id={view === 'monthly' ? 'active' : ''}>Monthly</button>
              <button className="tab" onClick={() => setView('yearly')} id={view === 'yearly' ? 'active' : ''}>Yearly</button>
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
    {/* Analysisi page */}
    <div className="analysis-container">
    <div className="custom-toggle-switch">
  <div className={`toggle-box ${type === 'income' ? 'on' : 'off'}`} onClick={() => setType(type === 'income' ? 'expense' : 'income')}>
    <div className={`show income-btn ${type === 'income' ? 'active' : ''}`}>Income</div>
    <div className={`show expense-btn ${type === 'expense' ? 'active' : ''}`}>Expense</div>

</div>
  
</div>

      {renderChartSection(`Current ${view} ${type}`, currentCategoryData)}
       {/* {view !== 'yearly' && renderChartSection(`Previous ${view} ${type}`, pastCategoryData)} */}

      {pastCategoryData.length > 0 && renderChartSection(`Previous ${view} ${type}`, pastCategoryData)}
        
        {/* Bottom Nav */}
              <div className="bottom-nav">
                <div onClick={ handleNavbarClick}><List className="bottom-icon" /> Transaction</div>
               <div onClick={handleAnalysisClick}><BarChart2 className="bottom-icon" /> Analysis</div>
                <div onClick={ handleAccountsClick}><Wallet className="bottom-icon" /> Account</div>
                <div><Briefcase className="bottom-icon" /> Business</div>
                <div onClick={ handleBudgetClick}><DollarSign className="bottom-icon" /> Budget</div>
              </div>
    </div>
     {/* Floating Action Button */}
          <button className="fab-button" onClick={handleAddClick}>
            <Plus className="fab-icon" />
          </button>
</div>
    
  );
};

export default Analysis;
