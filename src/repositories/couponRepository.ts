import { FilterQuery, UpdateQuery } from 'mongoose';
import Coupon, { ICoupon } from '../models/couponModel';

class CouponRepository {

    async create(couponData: Partial<ICoupon>): Promise<ICoupon> {
        const coupon = new Coupon(couponData);
        return await coupon.save();
    }

    async findById(id: string): Promise<ICoupon | null> {
        return await Coupon.findById(id);
    }

    async findOne(filter: FilterQuery<ICoupon>): Promise<ICoupon | null> {
        return await Coupon.findOne(filter);
    }

    async findAll(filter: FilterQuery<ICoupon>={}): Promise<ICoupon[]> {
        return await Coupon.find(filter);
    }

    async update(id: string, updateData: UpdateQuery<ICoupon>): Promise<ICoupon | null> {
        return await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id: string): Promise<ICoupon | null> {
        return await Coupon.findByIdAndUpdate(id,{isDeleted:true});
    }
}

export default new CouponRepository();
