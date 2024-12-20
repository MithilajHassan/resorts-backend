import mongoose, { Schema, Document } from 'mongoose';


export interface ICoupon extends Document {
  code: string;
  discount: number;
  minBooking: number;
  createdAt?: Date;
  expireAt: Date;
  isDeleted?: boolean;
}

const CouponSchema: Schema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  minBooking: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false }
});

CouponSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
