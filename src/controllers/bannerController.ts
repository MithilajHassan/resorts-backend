import { Request, Response } from "express";
import bannerServices from "../services/bannerServices";


class BannerController {
    async createBanner(req: Request, res: Response): Promise<Response> {
        try {
            const banner = await bannerServices.createBanner(req.body)
            return res.status(201).json(banner)
        } catch (error) {
            return res.status(500).json({ message: 'Error creating banner', error })
        }
    }

    async getAllBanners(req: Request, res: Response): Promise<Response> {
        try {
            const banners = await bannerServices.getAllBanners()
            return res.status(200).json(banners)
        } catch (error) {
            return res.status(500).json({ message: 'Error in banners', error })
        }
    }

    async getBannerById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const banner = await bannerServices.getBannerById(id);
            if (banner) {
                return res.status(200).json(banner);
            } else {
                return res.status(404).json({ message: 'Banner not found' })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving banner', error })
        }
    }

    async editBanner(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const banner = await bannerServices.editBanner(id,req.body)
            if (banner) {
                return res.status(200).json(banner);
            } else {
                return res.status(404).json({ message: 'Banner not found' })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error Editing banner', error })
        }
    }

    async deleteBannerById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const banner = await bannerServices.deleteBannerById(id);
            if (banner) {
                return res.status(200).json({ message: 'Banner deleted successfully' })
            } else {
                return res.status(404).json({ message: 'Banner not found' })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting banner', error })
        }
    }
}

export default new BannerController()