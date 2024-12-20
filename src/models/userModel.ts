import { Document, model, Schema } from "mongoose";
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    googleId?:string,
    name: string,
    email: string,
    phone?: number,
    password: string,
    walletBalance: number,
    avatar?: string,
    role: string,
    isBlock: boolean
}

const userSchema: Schema<IUser> = new Schema({
    googleId: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: false },
    password: { type: String, required: false },
    walletBalance: { type: Number, default: 0 },
    avatar: { type: String, required: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBlock: { type: Boolean, default: false },
})
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = model<IUser>('User', userSchema)

export default User