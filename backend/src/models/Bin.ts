import mongoose from 'mongoose';

export interface BinModel extends mongoose.Document {
  key: string;
  content: string;
  created: Date;
}

const schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  content: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

export const Bin = mongoose.model<BinModel>('Bin', schema);
