import { Schema, model, Document } from 'mongoose';

export interface IWishlist extends Document {
  userId: Schema.Types.ObjectId;
  resortId: Schema.Types.ObjectId;
  createdAt?: Date;
}

const wishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, required: true },
  resortId: { type: Schema.Types.ObjectId, required: true , ref:'Resort'},
  createdAt: { type: Date, default: Date.now }
});

const Wishlist = model<IWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
