import mongoose from 'mongoose';

export interface BinModel extends mongoose.Document {
  key: string;
  content: string;
  languageId: number;

  created: Date;
}

const schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  content: { type: String, required: true },
  languageId: { type: Number, required: true },

  created: { type: Date, default: Date.now },
});

export const Bin = mongoose.model<BinModel>('Bin', schema);
