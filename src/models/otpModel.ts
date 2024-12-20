import { model, Schema } from "mongoose"

export interface IOtp {
    email: string,
    otp: string,
    createdAt?: Date
}

const otpSchema = new Schema<IOtp>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '60s' }
})

const Otp = model('Otp', otpSchema)

export default Otp