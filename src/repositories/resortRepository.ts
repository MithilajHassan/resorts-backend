import mongoose from 'mongoose'
import { IResort, Resort } from '../models/resortModel'

export default new class ResortRepository {
    async createResort(resortData: IResort): Promise<IResort> {
        const newResort = new Resort(resortData)
        return await newResort.save()
    }

    async findByEmail(email: string): Promise<IResort | null> {
        return await Resort.findOne({ email })
    }

    async findResortById(id: string): Promise<IResort | null> {
        return await Resort.findById(id).populate('categories').populate('facilities')
    }

    async findAll(): Promise<IResort[] | []> {
        return await Resort.find().populate('categories').populate('facilities')
    }

    async findVerifiedResort(id: string): Promise<IResort | null> {
        return await Resort.findOne({ _id: id, isVerify: true, isBlock: false })
    }

    async findAllVerifiedResorts(): Promise<IResort[] | []> {
        return await Resort.find({ isVerify: true })
    }

    async accept(id: unknown): Promise<IResort | null> {
        return await Resort.findByIdAndUpdate(id, { $set: { isVerify: true } }, { new: true })
            .populate('categories').populate('facilities')
    }
    async reject(id: unknown): Promise<IResort | null> {
        return await Resort.findByIdAndUpdate(id, { $set: { isVerify: false, isRejected: true } }, { new: true })
            .populate('categories').populate('facilities')
    }
    async manageResortBlock(id: string, status: boolean): Promise<IResort | null> {
        return await Resort.findByIdAndUpdate(id, { $set: { isBlock: status } }, { new: true })
            .populate('categories').populate('facilities')
    }
    async editResort(resortData: IResort, id: string): Promise<IResort | null> {
        return await Resort.findByIdAndUpdate(id, { $set: resortData }, { new: true })
            .populate('categories').populate('facilities')
    }

    async findResortsByQuery({ place, categories, facilities, sortBy, page }
        : {
            place: string; categories?: string[]; facilities?: string[]; sortBy?: string; page: number
        }): Promise<{resorts:IResort[],totalResorts:number }> {

        const validCategories = categories ?categories.filter(id => mongoose.Types.ObjectId.isValid(id)):[]
        const validFacilities = facilities ?facilities.filter(id => mongoose.Types.ObjectId.isValid(id)):[]

        const query: any = {
            isBlock: false,
            isVerify: true,
            $or: [
                { city: { $regex: place, $options: "i" } },
                { resortName: { $regex: place, $options: "i" } },
            ],
        };

        if (validCategories.length > 0) {
            query.categories = { $all: validCategories };
        }

        if (validFacilities.length > 0) {
            query.facilities = { $all: validFacilities };
        }
        let sort: any = {};

        if (sortBy) {
            switch (sortBy) {
                case 'priceLowToHigh':
                    sort = { price: 1 };
                    break;
                case 'priceHighToLow':
                    sort = { price: -1 };
                    break;
                case 'name':
                    sort = { resortName: 1 };
                    break;
                default:
                    sort = {};
            }
        }
        const limit = 3; 
        const skip = (page - 1) * limit; 
      
        const totalResorts = await Resort.countDocuments(query);
      
        const resorts = await Resort.find(query).sort(sort).skip(skip).limit(limit);
      
        return {resorts,totalResorts}
    }
}