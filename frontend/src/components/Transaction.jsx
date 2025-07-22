import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/income.css';
import Swal from 'sweetalert2';

const Transaction = () => {
  const getCurrentDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16); // Returns "YYYY-MM-DDTHH:mm"
  }
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    notes: '',
    date: getCurrentDateTime(), // ← correct format // Default date & time
  });
  const [accounts, setAccounts] = useState([]);
  const [errors, setErrors] = useState({});
   useEffect(() => {
      // Fetch account types for the dropdown
      const fetchAccounts = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/account');
          setAccounts(response.data);
        } catch (err) {
          console.error('Failed to fetch accounts', err);
        }
      };
  
      fetchAccounts();
    }, []);
    //old date get format
  // useEffect(() => {
  //   const now = new Date();
  //   setFormData(prev => ({
  //     ...prev,
  //     date: now.toISOString().slice(0, 16)
  //   }));
  // }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, clearForm = false) => {
    e.preventDefault();

      const newErrors = {};
    const { from, to, amount, notes, date } = formData;

    if (!from) newErrors.accountType = "Please select an from acc";
    if (!to) newErrors.category = "Please select a to acc";
    if (!amount) newErrors.amount = "Please enter an amount";
    if (!date) newErrors.date = "Please select date and time";

    if (formData.from === formData.to) {
      Swal.fire("Error", "From and To accounts cannot be the same", "error");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const payload = { ...formData };
  
    try {
      const response = await fetch('http://localhost:5000/api/transaction/add-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('transaction saved successfully');
        if (clearForm) {
          setFormData({
            from: '',
            to: '',
            amount: '',
            notes: '',
            date: new Date().toISOString().slice(0, 16),
          });
          
        }
      } else {
        alert('Failed to save transaction');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving transaction');
    }
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    setFormData({
      from: '',
      to: '',
      amount: '',
      notes: '',
      date: getCurrentDateTime(), // ← correct format
    });
    navigate('/');
  };

  return (
    <div >
      <br /><br />
      
      <form onSubmit={handleSubmit}>
        {/* From */}
        {/* <div className="form-group">
          <label>From</label>
           <select
            name="from"
            value={formData.from}
            onChange={handleChange}
          >
             <option value="">From Acc</option>
             {accounts.map(account => (
              <option key={account._id} value={account.accountType}>
               {account.accountType}
             </option>
        ))}
          </select>
        </div>
         */}
        {/* To */}
        {/* <div className="form-group">
          <label>To</label>
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
          >
             <option value="">To Acc</option>
             {accounts.map(account => (
              <option key={account._id} value={account.accountType}>
               {account.accountType}
             </option>
        ))}
          </select>
        </div> */}
        
        {/* Amount */}
        {/* <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
        </div> */}

        {/* Notes */}
        {/* <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any notes here"
          />
        </div> */}

        {/* Date & Time */}
      {/* <div className="form-group">
        <label>Date & Time</label>
        <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      </div> */}

        {/* form Type */}
         <div className="form-group">
          <label>From</label>
           <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className={errors.from ? 'input-error' : ''}
          >
             <option value="">From Acc</option>
             {accounts.map(account => (
              <option key={account._id} value={account.accountType}>
               {account.accountType}
             </option>
        ))}
          </select>
           {errors.from && <div className="error-text">{errors.from}</div>}
        </div>
          {/* to type choose */}
        <div className="form-group">
          <label>To</label>
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
             className={errors.to ? 'input-error' : ''}
          >
             <option value="">To Acc</option>
             {accounts.map(account => (
              <option key={account._id} value={account.accountType}>
               {account.accountType}
             </option>
        ))}
          </select>
           {errors.to && <div className="error-text">{errors.to}</div>}
        </div>
        
        {/* Amount */}
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className={errors.amount ? 'input-error' : ''}
          />
          {errors.amount && <div className="error-text">{errors.amount}</div>}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any notes here"
            className={errors.notes ? 'input-error' : ''}
          />
          {errors.notes && <div className="error-text">{errors.notes}</div>}
        </div>
        {/* Date & Time */}
    <div className="form-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'input-error' : ''}
          />
          {errors.date && <div className="error-text">{errors.date}</div>}
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="button" className="btn-save" onClick={(e) => handleSubmit(e, false)}>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Transaction;
