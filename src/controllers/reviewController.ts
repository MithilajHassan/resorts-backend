import { Request, Response } from 'express';
import reviewServices from '../services/reviewServices';
import { IReview } from '../models/reviewModel';
import CustomError from '../errors/customError';

class ReviewController {
    async createReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewData: IReview = req.body;
            const newReview = await reviewServices.createReview(reviewData);
            res.status(201).json({review:newReview});
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    async getReviewByBookingId(req: Request, res: Response): Promise<void> {
        try {
            const bookingId = req.params.id;
            const review = await reviewServices.findByBookingId(bookingId);
            if (!review) {
                res.status(404).json({ message: 'Review not found' });
                return;
            }
            res.status(200).json(review);
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    async getReviewsByResortId(req: Request, res: Response): Promise<void> {
        try {
            const resortId = req.params.id;
            const reviews = await reviewServices.findByResortId(resortId);
            if (!reviews || reviews.length === 0) {
                res.status(404).json({ message: 'No reviews found' });
                return;
            }
            res.status(200).json({reviews});
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
}

export default new ReviewController()
