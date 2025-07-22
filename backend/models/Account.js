import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountType: { type: String, required: true },
});

export default mongoose.model('Account', accountSchema);
