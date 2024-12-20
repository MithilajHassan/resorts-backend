import { Request, Response } from 'express';
import wishlistService from '../services/wishlistServices';
import CustomError from '../errors/customError';

class WishlistController {
    async createWishlist(req: Request, res: Response) {
        try {
            const { userId, resortId } = req.body;
            const wishlistItem = await wishlistService.addWishlistItem(userId, resortId);
            res.status(201).json(wishlistItem);
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    async deleteWishlist(req: Request, res: Response) {
        try {
            const { id } = req.body;
            const result = await wishlistService.removeWishlistItem(id);
            if (result.deletedCount) {
                res.status(200).json({ message: 'Wishlist item deleted', success:true });
            } else {
                res.status(404).json({ message: 'Wishlist item not found', success:false });
            }
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    async getUserWishlist(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const wishlist = await wishlistService.getWishlistByUser(userId)
            res.status(200).json({wishlist})
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

export default new WishlistController();
