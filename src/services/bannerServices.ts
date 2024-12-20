import { IBanner } from "../models/bannerModel";
import bannerRepository from "../repositories/bannerRepository";



class BannerService {
    async createBanner(data: Partial<IBanner>): Promise<IBanner> {
        return bannerRepository.createBanner(data);
    }

    async getAllBanners(): Promise<IBanner[]> {
        return bannerRepository.getAllBanners();
    }

    async getBannerById(id: string): Promise<IBanner | null> {
        return bannerRepository.getBannerById(id);
    }

    async editBanner(id:string,BannerData:IBanner): Promise<IBanner | null> {
        return bannerRepository.editBanner(id,BannerData)
    }

    async deleteBannerById(id: string): Promise<IBanner | null> {
        return bannerRepository.deleteBannerById(id);
    }
}

export default new BannerService();