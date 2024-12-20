import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    imageUrl: string;
    description?: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const BannerSchema: Schema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    active: { type:String , default:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const BannerModel = mongoose.model<IBanner>('Banner', BannerSchema);
export default BannerModel;
