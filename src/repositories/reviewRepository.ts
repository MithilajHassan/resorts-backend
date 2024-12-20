import Review, { IReview } from "../models/reviewModel";

export default new class ReviewRepository {
    
    async create(reviewData:IReview): Promise<IReview> {
        const review = new Review(reviewData)
        return await review.save()
    }

    async findByBookingId(id:string): Promise<IReview | null> {
        return await Review.findOne({bookingId:id}).populate('userId')
    }

    async findByResortId(id:string): Promise<IReview[] | null> {
        return await Review.find({resortId:id}).populate('userId','name avatar')
    }

}