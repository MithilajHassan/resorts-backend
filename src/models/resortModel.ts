import { Document, model, ObjectId, Schema } from "mongoose"
import bcrypt from 'bcrypt'

export interface IResort extends Document {
    resortName: string,
    email: string,
    password: string,
    address: string,
    city: string,
    phone: string,
    description: string,
    categories: ObjectId[],
    facilities: ObjectId[],
    images: string[],
    isVerify?: boolean,
    isBlock?: boolean,
    location:{
        lat: number;
        lng: number;
    },
    isRejected?:boolean
}
const resortSchema = new Schema<IResort>({
    resortName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    facilities: [{ type: Schema.Types.ObjectId, ref: 'Facility' }],
    images: [{ type: String }],
    isVerify: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    location: { 
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    isRejected: { type: Boolean, default: false }
    
}, {
    timestamps: true
})

resortSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

export const Resort = model<IResort>('Resort', resortSchema)