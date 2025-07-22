import React, { useEffect, useState } from 'react';
import '../style/accounts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const [categorys, setCategorys] = useState([]);
  const [formData, setFormData] = useState({ categoryType: '' });
  const [editId, setEditId] = useState(null);

  const fetchCategorys = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/category');
      setCategorys(res.data);
    } catch (err) {
      console.error('Error fetching categorys:', err);
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, []);

  const handleChange = (e) => {
    setFormData({ categoryType: e.target.value });
  };

  const handleAdd = async () => {
    if (!formData.categoryType.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/category', formData);
      setFormData({ categoryType: '' });
      fetchCategorys();
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/category/${id}`);
      fetchCategorys();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleEdit = (id, type) => {
    setEditId(id);
    setFormData({ categoryType: type });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/category/${editId}`, formData);
      setFormData({ categoryType: '' });
      setEditId(null);
      fetchCategorys();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };
   const navigate = useNavigate();
   const goBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <div className="accounts-container">
       <button onClick={goBack} className="back-button">
        ← Back
      </button>
      <h2>Manage Categorys</h2>

      <div className="account-form">
        <input
          type="text"
          name="categoryType"
          placeholder="Enter category type"
          value={formData.categoryType}
          onChange={handleChange}
        />
        {editId ? (
          <button onClick={handleUpdate}>Update</button>
        ) : (
          <button onClick={handleAdd}>Add Item</button>
        )}
      </div>

      <ul className="account-list">
        {categorys.map((category) => (
          <li key={category._id}>
            {category.categoryType}
            <button onClick={() => handleEdit(category._id, category.categoryType)}>Edit</button>
            <button onClick={() => handleDelete(category._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
