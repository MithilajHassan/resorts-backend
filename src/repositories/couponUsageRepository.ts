import CouponUsage, { ICouponUsage } from "../models/couponUsageModel";

class CouponUsageRepository {

    async createCouponUsage(userId: string, couponId: string): Promise<ICouponUsage> {
        const couponUsage = new CouponUsage({
            userId,
            couponId
        });
        return await couponUsage.save();
    }

    async findUsageByUserAndCoupon(userId: string, couponId: string): Promise<ICouponUsage | null> {
        return await CouponUsage.findOne({ userId, couponId })
    }

}

export default new CouponUsageRepository
