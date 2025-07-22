import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/acc.css';
import Footer from './Footer';
import Header from './Header';

const API = import.meta.env.VITE_BACKEND_URL;

const Accounts = () => {
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [incomesRes, expensesRes, transactionRes] = await Promise.all([
        axios.get(`${API}/api/income`),
        axios.get(`${API}/api/expense`),
        axios.get(`${API}/api/transaction`),
      ]);

      const incomeGroups = {}, expenseGroups = {};
      incomesRes.data.forEach(i => {
        const type = i.accountType?.toLowerCase().trim();
        if (type) incomeGroups[type] = (incomeGroups[type] || 0) + Number(i.amount);
      });
      expensesRes.data.forEach(e => {
        const type = e.accountType?.toLowerCase().trim();
        if (type) expenseGroups[type] = (expenseGroups[type] || 0) + Number(e.amount);
      });

      const debitTransfers = {}, creditTransfers = {};
      transactionRes.data.forEach(t => {
        const fromType = t.from?.toLowerCase().trim();
        const toType = t.to?.toLowerCase().trim();
        const amt = Number(t.amount) || 0;
        if (fromType) debitTransfers[fromType] = (debitTransfers[fromType] || 0) + amt;
        if (toType) creditTransfers[toType] = (creditTransfers[toType] || 0) + amt;
      });

      const allTypes = new Set([
        ...Object.keys(incomeGroups),
        ...Object.keys(expenseGroups),
        ...Object.keys(debitTransfers),
        ...Object.keys(creditTransfers),
      ]);

      const results = Array.from(allTypes).map(type => {
        const totalIncome = incomeGroups[type] || 0;
        const totalExpense = expenseGroups[type] || 0;
        const debited = debitTransfers[type] || 0;
        const credited = creditTransfers[type] || 0;
        const balance = totalIncome - totalExpense;
        return { accountType: type, totalIncome, totalExpense, debited, credited, balance };
      });

      setAccountData(results.sort((a, b) => a.accountType.localeCompare(b.accountType)));
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="account-summary">
        <div className="account-header-row">
          <span>Account</span>
          <span>Income</span>
          <span>Expense</span>
          <span>Balance</span>
        </div>
        <div className="account-list">
          {accountData.length === 0 ? (
            <p className="empty-message">No account data found.</p>
          ) : (
            accountData.map((acc, idx) => (
              <div className="account-card" key={idx}>
                <span className="type">{acc.accountType.toUpperCase()}</span>
                <span className="income">₹{acc.totalIncome.toFixed(2)}</span>
                <span className="expense">-₹{acc.totalExpense.toFixed(2)}</span>
                <span className={`balance ${acc.balance < 0 ? 'negative' : ''}`}>
                  ₹{acc.balance.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Accounts;
