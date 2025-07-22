// Accounts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/acc.css';
import Footer from './Footer';
import Header from './Header';

const Accounts = () => {
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch income, expense, and transactions
        const [incomesRes, expensesRes, transactionRes] = await Promise.all([
          axios.get('http://localhost:5000/api/income'),
          axios.get('http://localhost:5000/api/expense'),
          axios.get('http://localhost:5000/api/transaction'), // ✅ fetch all transfers
        ]);

        // group incomes
        const incomeGroups = {};
        incomesRes.data.forEach(i => {
          const type = i.accountType?.toLowerCase().trim();
          if (!type) return;
          incomeGroups[type] = (incomeGroups[type] || 0) + Number(i.amount);
        });

        // group expenses
        const expenseGroups = {};
        expensesRes.data.forEach(e => {
          const type = e.accountType?.toLowerCase().trim();
          if (!type) return;
          expenseGroups[type] = (expenseGroups[type] || 0) + Number(e.amount);
        });

        // group transfers (deduct from `from`, add to `to`)
        const debitTransfers = {};  // how much was sent out
        const creditTransfers = {}; // how much was received
        transactionRes.data.forEach(t => {
          const fromType = t.from?.toLowerCase().trim();
          const toType = t.to?.toLowerCase().trim();
          const amt = Number(t.amount) || 0;

          if (fromType) {
            debitTransfers[fromType] = (debitTransfers[fromType] || 0) + amt;
          }
          if (toType) {
            creditTransfers[toType] = (creditTransfers[toType] || 0) + amt;
          }
        });

        // merge all account types
        const allAccountTypes = new Set([
          ...Object.keys(incomeGroups),
          ...Object.keys(expenseGroups),
          ...Object.keys(debitTransfers),
          ...Object.keys(creditTransfers),
        ]);

        // build final array
        const results = Array.from(allAccountTypes).map(type => {
          const totalIncome = incomeGroups[type] || 0;
          const totalExpense = expenseGroups[type] || 0;
          const debited = debitTransfers[type] || 0;
          const credited = creditTransfers[type] || 0;

          // 🔥 balance formula: income - expense - transferred out + transferred in
          const balance = totalIncome - totalExpense;

          return {
            accountType: type,
            totalIncome,
            totalExpense,
            debited,
            credited,
            balance,
          };
        }).sort((a, b) => a.accountType.localeCompare(b.accountType));

        setAccountData(results);
      } catch (err) {
        console.error('❌ Error fetching account data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="account-summary">
        {/* Header row */}
        <div className="account-header-row">
          <span>Account</span>
          <span>Income</span>
          <span>Expense</span>
          <span>Balance</span>
        </div>

        {/* Account list */}
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
