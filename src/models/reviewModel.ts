import { Schema, model, Document } from 'mongoose';


export interface IReview extends Document {
  bookingId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  resortId: Schema.Types.ObjectId;
  reviewText: string;
  rating: number; 
  reviewDate?: Date;
}

const reviewSchema = new Schema<IReview>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resortId: {
    type: Schema.Types.ObjectId,
    ref: 'Resort',
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

const Review = model<IReview>('Review', reviewSchema);

export default Review;
