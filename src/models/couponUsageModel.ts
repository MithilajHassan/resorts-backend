import { Schema, model, Document, Types } from 'mongoose';

export interface ICouponUsage extends Document {
  userId: Types.ObjectId;
  couponId: Types.ObjectId;
  usedAt?: Date;
}

const CouponUsageSchema = new Schema<ICouponUsage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
  usedAt: { type: Date, default: Date.now },
});

const CouponUsage = model<ICouponUsage>('CouponUsage', CouponUsageSchema)
export default CouponUsage
