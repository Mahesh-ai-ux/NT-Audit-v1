import React, { useEffect, useState } from 'react';
import '../style/accounts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({ accountType: '' });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/account`);
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({ accountType: e.target.value });
  };

  const handleAdd = async () => {
    if (!formData.accountType.trim()) return;
    try {
      await axios.post(`${BASE_URL}/api/account`, formData);
      setFormData({ accountType: '' });
      fetchAccounts();
    } catch (err) {
      console.error('Error adding account:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/account/${id}`);
      fetchAccounts();
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const handleEdit = (id, type) => {
    setEditId(id);
    setFormData({ accountType: type });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/api/account/${editId}`, formData);
      setFormData({ accountType: '' });
      setEditId(null);
      fetchAccounts();
    } catch (err) {
      console.error('Error updating account:', err);
    }
  };

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="accounts-container">
      <button onClick={goBack} className="back-button">
        ← Back
      </button>
      <h2>Manage Accounts</h2>

      <div className="account-form">
        <input
          type="text"
          name="accountType"
          placeholder="Enter account type"
          value={formData.accountType}
          onChange={handleChange}
        />
        {editId ? (
          <button onClick={handleUpdate}>Update</button>
        ) : (
          <button onClick={handleAdd}>Add Item</button>
        )}
      </div>

      <ul className="account-list">
        {accounts.map((account) => (
          <li key={account._id}>
            {account.accountType}
            <button onClick={() => handleEdit(account._id, account.accountType)}>Edit</button>
            <button onClick={() => handleDelete(account._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Account;
