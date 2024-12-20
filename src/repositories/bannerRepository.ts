import Banner, { IBanner } from '../models/bannerModel';

class BannerRepository {
    async createBanner(data: Partial<IBanner>): Promise<IBanner> {
        const banner = new Banner(data);
        return banner.save();
    }

    async getAllBanners(): Promise<IBanner[]> {
        return Banner.find();
    }

    async getBannerById(id: string): Promise<IBanner | null> {
        return Banner.findById(id);
    }

    async editBanner(id:string,BannerData:IBanner): Promise<IBanner | null> {
        return Banner.findByIdAndUpdate(id,{
            title:BannerData.title,
            description:BannerData.description,
            imageUrl:BannerData.imageUrl
        },{new:true});
    }

    async deleteBannerById(id: string): Promise<IBanner | null> {
        return Banner.findByIdAndDelete(id);
    }
}

export default new BannerRepository();