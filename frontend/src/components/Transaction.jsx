import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/income.css';
import Swal from 'sweetalert2';

const API = import.meta.env.VITE_BACKEND_URL;

const Transaction = () => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    notes: '',
    date: getCurrentDateTime(),
  });

  const [accounts, setAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${API}/api/account`);
        setAccounts(response.data);
      } catch (err) {
        console.error('Failed to fetch accounts', err);
      }
    };

    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, clearForm = false) => {
    e.preventDefault();

    const newErrors = {};
    const { from, to, amount, date } = formData;

    if (!from) newErrors.from = "Please select a from account";
    if (!to) newErrors.to = "Please select a to account";
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
    try {
      const response = await fetch(`${API}/api/transaction/add-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Transaction saved successfully!',
        });

        if (clearForm) {
          setFormData({
            from: '',
            to: '',
            amount: '',
            notes: '',
            date: getCurrentDateTime(),
          });
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Failed to save transaction',
        });
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      from: '',
      to: '',
      amount: '',
      notes: '',
      date: getCurrentDateTime(),
    });
    navigate('/');
  };

  return (
    <div>
      <br /><br />
      <form onSubmit={handleSubmit}>
        {/* From */}
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

        {/* To */}
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
          <button type="button" className="btn-save" onClick={(e) => handleSubmit(e, true)}>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Transaction;
