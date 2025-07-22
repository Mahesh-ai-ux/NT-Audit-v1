import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/category.css';

const API = import.meta.env.VITE_BACKEND_URL;

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('income');

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/api/category`);
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return;
    await axios.post(`${API}/api/category`, { category, type });
    setCategory('');
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/category/${id}`);
    fetchCategories();
  };

  return (
    <div className="category-container">
      <h2>Manage Categories</h2>
      <form onSubmit={handleSubmit}>
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id}>
            {cat.category} ({cat.type})
            <button onClick={() => handleDelete(cat._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
