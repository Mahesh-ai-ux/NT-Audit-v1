import React from 'react';
import '../style/navbar.css';
import { useNavigate } from 'react-router-dom';
import {  Plus, List, BarChart2, Wallet, Briefcase, DollarSign } from 'lucide-react';

const Footer = () => {
    const navigate = useNavigate();
    const handleAddClick = () => navigate('/add-expense');
    const handleAnalysisClick = () => {navigate('/analysis');};
   const handleAccountsClick= () => { navigate('/accounts')};
   const handleNavbarClick = () => navigate('/navbar');
    const handleBudgetClick = () => navigate('/budget');

  return (
    <div>
       <div className="bottom-nav">
              <div onClick={ handleNavbarClick}><List className="bottom-icon" /> Transaction</div>
             <div onClick={handleAnalysisClick}><BarChart2 className="bottom-icon" /> Analysis</div>
              <div onClick={handleAccountsClick}><Wallet className="bottom-icon" /> Account</div>
              <div ><Briefcase className="bottom-icon" /> Business</div>
              <div onClick={handleBudgetClick}><DollarSign className="bottom-icon" /> Budget</div>
            </div>
      
            {/* Floating Action Button */}
            <button className="fab-button" onClick={handleAddClick}>
              <Plus className="fab-icon" />
            </button>
    </div>
  )
}

export default Footer
