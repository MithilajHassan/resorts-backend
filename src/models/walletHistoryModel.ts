import { Schema, model, Document, Types } from 'mongoose';

export interface IWalletHistory extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: 'Deposit' | 'Purchase' | 'Refund';
  createdAt?: Date;
}

const walletSchema = new Schema<IWalletHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Deposit', 'Purchase', 'Refund'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WalletHistory = model<IWalletHistory>('WalletHistory', walletSchema);

export default WalletHistory;
