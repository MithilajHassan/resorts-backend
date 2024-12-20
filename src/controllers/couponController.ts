import { Request, Response } from 'express';
import couponServices from '../services/couponServices';
import CustomError from '../errors/customError';

class CouponController {
    async createCoupon(req: Request, res: Response): Promise<void> {
        try {
            const newCoupon = await couponServices.createCoupon(req.body);
            res.status(201).json({ success: true, data: newCoupon });
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async getCoupon(req: Request, res: Response): Promise<void> {
        try {
            const coupon = await couponServices.getCouponById(req.params.id);
            res.status(200).json({ success: true, data: coupon });
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async getAllCoupons(req: Request, res: Response): Promise<void> {
        try {
            const coupons = await couponServices.getAllCoupons();
            res.status(200).json({ success: true, data: coupons });
        } catch (err: any) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.log(err.message)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async updateCoupon(req: Request, res: Response): Promise<void> {
        try {
            const updatedCoupon = await couponServices.updateCoupon(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedCoupon });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteCoupon(req: Request, res: Response): Promise<void> {
        try {
            await couponServices.deleteCoupon(req.params.id);
            res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAvailableCoupons(req: Request, res: Response): Promise<void> {
        try {
            const coupons = await couponServices.getAvailableCoupons(Number(req.query.price))
            res.status(200).json({ success: true, data: coupons });
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async applyCoupon(req: Request, res: Response): Promise<void> {
        try {
            const { userId, couponId }: { userId: string, couponId: string } = req.body
            await couponServices.applyCoupon(userId, couponId)
            res.status(200).json({ success: true });
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

}

export default new CouponController();
