import wishlistRepository from '../repositories/wishlistRepository';
import { IWishlist } from '../models/wishlistModel';
import CustomError from '../errors/customError';

class WishlistService {
    async addWishlistItem(userId: string, resortId: string) {
        const result = await wishlistRepository.create(userId, resortId);
        if (!result) {
            throw new CustomError('Wishlist item already exists',409);
        }
        return result;
    }

    async removeWishlistItem(id: string) {
        return await wishlistRepository.delete(id);
    }

    async getWishlistByUser(userId: string) {
        return await wishlistRepository.findByUserId(userId);
    }
}

export default new WishlistService();
