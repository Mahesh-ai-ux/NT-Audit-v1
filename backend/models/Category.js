import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryType: { type: String, required: true },
});

export default mongoose.model('Category', categorySchema);
