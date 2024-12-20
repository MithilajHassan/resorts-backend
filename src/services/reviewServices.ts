import CustomError from "../errors/customError";
import { IReview } from "../models/reviewModel";
import reviewRepository from "../repositories/reviewRepository";


class reviewServices {
    async createReview(reviewData:IReview): Promise<IReview> {
        const exist = await reviewRepository.findByBookingId(String(reviewData.bookingId))
        if(exist){
            throw new CustomError('You already reviewed',409)
        }
        return await reviewRepository.create(reviewData)
    }

    async findByBookingId(id:string): Promise<IReview | null> {
        return await reviewRepository.findByBookingId(id)
    }

    async findByResortId(id:string): Promise<IReview[] | null> {
        return await reviewRepository.findByResortId(id)
    }
}

export default new reviewServices