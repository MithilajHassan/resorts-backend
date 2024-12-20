import couponRepository from '../repositories/couponRepository';
import { ICoupon } from '../models/couponModel';
import CustomError from '../errors/customError';
import couponUsageRepository from '../repositories/couponUsageRepository';

class CouponService {

    async createCoupon(data: Partial<ICoupon>): Promise<ICoupon> {

        const existingCoupon = await couponRepository.findOne({ code: data.code });
        if (existingCoupon) {
            throw new CustomError('Coupon code already exists',409)
        }
        return await couponRepository.create(data);
    }

    async getCouponById(id: string): Promise<ICoupon | null> {
        const coupon = await couponRepository.findById(id);
        if (!coupon) {
            throw new CustomError('Coupon not found',404)
        }
        return coupon
    }

    async getAllCoupons(): Promise<ICoupon[]> {
        return await couponRepository.findAll({isDeleted:false});
    }

    async updateCoupon(id: string, updateData: Partial<ICoupon>): Promise<ICoupon | null> {
        const existingCoupon = await couponRepository.findOne({ code: updateData.code });
        if (existingCoupon && id != existingCoupon._id) {
            throw new CustomError('Coupon code already exists',409)
        }
        return await couponRepository.update(id, updateData);
    }

    async deleteCoupon(id: string): Promise<ICoupon | null> {
        return await couponRepository.delete(id);
    }

    async getAvailableCoupons(price:number): Promise<ICoupon[]> {
        return await couponRepository.findAll({minBooking:{$lte:price}});
    }
    async applyCoupon(userId:string,couponId:string){
        const exist = await couponUsageRepository.findUsageByUserAndCoupon(userId,couponId)
        if(exist){
            throw new CustomError('Coupon is already used',400)
        }
        return couponUsageRepository.createCouponUsage(userId,couponId)
    }
}

export default new CouponService();
