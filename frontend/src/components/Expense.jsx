import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import '../style/income.css';
const Expense = () => {
  const getCurrentDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16); // Returns "YYYY-MM-DDTHH:mm"
};
  const [formData, setFormData] = useState({
    accountType: '',
    category: '',
    amount: '',
    notes: '',
    photo: '',
    date: getCurrentDateTime(), // ← correct format  // Default date & time
  });
  const [accounts, setAccounts] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [errors, setErrors] = useState({});
  // useEffect(() => {
  //   const now = new Date();
  //   setFormData(prev => ({
  //     ...prev,
  //     date: now.toISOString().slice(0, 16)
  //   }));
  // }, []);

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  // Store image data
      };
      reader.readAsDataURL(file);
    }
  };
  
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
  useEffect(() => {
    // Fetch category types for the dropdown
    const fetchCategorys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/category');
        setCategorys(response.data);
      } catch (err) {
        console.error('Failed to fetch category', err);
      }
    };

    fetchCategorys();
  }, []);

const handleSubmit = async (e, clearForm = false) => {
  e.preventDefault();

  const newErrors = {};
  const { accountType, category, amount, notes, date } = formData;

  if (!accountType) newErrors.accountType = "Please select an account";
  if (!category) newErrors.category = "Please select a category";
  if (!amount) newErrors.amount = "Please enter an amount";
  if (!date) newErrors.date = "Please select date and time";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  try {
    // Get balances
    const [incomeRes, expenseRes] = await Promise.all([
      axios.get('http://localhost:5000/api/income'),
      axios.get('http://localhost:5000/api/expense'),
    ]);

    const selectedAccount = formData.accountType;

    const totalIncome = incomeRes.data
      .filter(item => item.accountType === selectedAccount)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalExpense = expenseRes.data
      .filter(item => item.accountType === selectedAccount)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const balance = totalIncome - totalExpense;

    if (Number(amount) > balance) {
      await Swal.fire({
        icon: 'error',
        title: 'Insufficient Balance',
        text: `Only ₹${balance.toFixed(2)} available in ${selectedAccount}.`,
      });
      return; // stop before POST
    }

//budget page
const month = new Date(formData.date).getMonth() + 1;
const year = new Date(formData.date).getFullYear();

// Fetch Budget
const budgetRes = await axios.get('http://localhost:5000/api/budget', {
  params: {
    accountType: formData.accountType,
    category: formData.category,
    month,
    year
  }
});
const budgetData = budgetRes.data;
const categoryBudget = budgetData?.budgetAmount || 0;

// Get total spent so far in this category this month
const expensesRes = await axios.get('http://localhost:5000/api/expense');
const monthlyCategoryTotal = expensesRes.data
  .filter(e =>
    e.accountType === formData.accountType &&
    e.category === formData.category &&
    new Date(e.date).getMonth() + 1 === month &&
    new Date(e.date).getFullYear() === year
  )
  .reduce((sum, e) => sum + Number(e.amount), 0);

// If exceeding budget
const newTotal = monthlyCategoryTotal + Number(formData.amount);
if (categoryBudget > 0 && newTotal > categoryBudget) {
  const result = await Swal.fire({
    title: "Over Budget",
    text: `Your total spending in ${formData.category} will exceed your budget of ₹${categoryBudget}. Continue?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Proceed",
    cancelButtonText: "No, Cancel"
  });

  if (!result.isConfirmed) return; // cancel submission
}


    // balance is enough, post
    const payload = { ...formData, photo: image };
    const response = await fetch('http://localhost:5000/api/expense/add-expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Expense saved successfully!',
      });
      if (clearForm) {
        setFormData({
          accountType: '',
          category: '',
          amount: '',
          notes: '',
          photo: '',
          date: getCurrentDateTime(),
        });
        setImage(null);
      }
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Failed to save expense',
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

  
  const navigate = useNavigate();
  const handleCancel = () => {
    setFormData({
      accountType: '',
      category: '',
      amount: '',
      notes: '',
      photo: '',
      date: getCurrentDateTime(), // ← correct format
    });
    setImage(null);
    navigate('/');
  };


 
  

  return (

  
    <div >
     
      <br /><br />
      <form onSubmit={handleSubmit}>
        {/* Account Type */}
         <div className="form-group">
          <label>Account</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className={errors.accountType ? 'input-error' : ''}
          >
            <option value="">Select Account</option>
            {accounts.map(account => (
              <option key={account._id} value={account.accountType}>
                {account.accountType}
              </option>
            ))}
          </select>
          {errors.accountType && <div className="error-text">{errors.accountType}</div>}
        </div>
        
        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'input-error' : ''}
          >
            <option value="">Select Category</option>
            {categorys.map(category => (
              <option key={category._id} value={category.categoryType}>
                {category.categoryType}
              </option>
            ))}
          </select>
          {errors.category && <div className="error-text">{errors.category}</div>}
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

        {/* Photo */}
        <div className="form-group">
          <label>Photo</label>
          <div className="photo-buttons">
            <input
              type="file"
              accept="image/*"
              id="gallery-input"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="gallery-input" className="photo-btn">Gallery</label>
            <button
              type="button"
              className="photo-btn"
              onClick={() => document.getElementById('camera-input').click()}
            >Camera</button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="camera-input"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          {errors.image && <div className="error-text">{errors.image}</div>}
        </div>
      {/* Display Image */}
        {image && (
          <div className="image-preview">
            <img src={image} alt="Uploaded" width="100" height="100" />
          </div>
        )}

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
          <button type="submit" className="btn-save-continue" onClick={(e) => handleSubmit(e, true)}>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Expense;
