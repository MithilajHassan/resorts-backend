import Wishlist, { IWishlist } from '../models/wishlistModel';

class WishlistRepository {
    async create(userId: string, resortId: string): Promise<IWishlist | null> {
        const existingItem = await Wishlist.findOne({ userId, resortId });
        if (existingItem) {
            return null; 
        }
        const wishlistItem = new Wishlist({ userId, resortId });
        return (await wishlistItem.save()).populate('resortId');
    }

    async delete(id: string): Promise<{ deletedCount?: number }> {
        return await Wishlist.deleteOne({ _id:id });
    }

    async findByUserId(userId: string): Promise<IWishlist[]> {
        return await Wishlist.find({ userId }).populate('resortId');
    }
    // async findOne(userId: string, resortId: string):Promise<IWishlist | null> {
    //     return await Wishlist.findOne({ userId, resortId })
    // }
}

export default new WishlistRepository()
