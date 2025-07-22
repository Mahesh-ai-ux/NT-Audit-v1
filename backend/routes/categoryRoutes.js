import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const categorys = await Category.find();
  res.json(categorys);
});

router.post('/', async (req, res) => {
  const { categoryType } = req.body;
  const newCategory = new Category({ categoryType });
  await newCategory.save();
  res.json(newCategory);
});

router.put('/:id', async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category Deleted' });
});

export default router;
