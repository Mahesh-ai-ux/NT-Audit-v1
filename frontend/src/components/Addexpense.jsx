import React,{useState} from 'react';
import '../style/addexpense.css';
import Income from './Income';
import Expense from './Expense';
import Transaction from './Transaction';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
  
  // 'income', 'expense', or 'transaction'
  const [formType, setFormType] = useState('income'); 
  const handleClick = (type) => {
    setFormType(type);
    
  };

  const handleClose = () => {
    
    setFormType('');
  };

  const navigate = useNavigate();

  const handleClosepage = () => {
    navigate(-1); // or navigate("/dashboard") to go to a specific route
  };
   
  return (
    <div className="add-expense-container">
      {formType && (
          <div className="close-section">
            <button className="close-button" onClick={handleClosepage}>×</button>
          </div>
        )}
      <div className="button-group">
        <button className={`btn-record ${formType === 'income' ? 'active' : ''}`} onClick={() => handleClick('income')}>Income</button>
        <button className={`btn-record ${formType === 'expense' ? 'active' : ''}`} onClick={() => handleClick('expense')}>Expense</button>
        <button className={`btn-record ${formType === 'transaction' ? 'active' : ''}`} onClick={() => handleClick('transaction')}>Transaction</button>
      </div>
    
      <div className="expense-table">
        
        {formType === 'income' && <Income formType="income" onClose={handleClose} />}
        {formType === 'expense' && <Expense formType="expense" onClose={handleClose} />}
        {formType === 'transaction' && <Transaction formType="transaction" onClose={handleClose}/>}
       
      </div> 
    </div>
  );
};

export default AddExpense;