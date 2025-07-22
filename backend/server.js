import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';

dotenv.config();
const app = express();

// 👇 Increase the body size limit (e.g., 10mb)
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.json());
app.use('/api/income', incomeRoutes);
app.use('/api/expense',expenseRoutes);
app.use('/api/transaction',transactionRoutes);
app.use('/api/account',accountRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/budget',budgetRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));