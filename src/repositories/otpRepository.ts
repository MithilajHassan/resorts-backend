import Otp, { IOtp } from "../models/otpModel";

export default new class OtpRepository {

    async create(otpDetails:IOtp):Promise<IOtp> {
        const otp = new Otp(otpDetails)
        return await otp.save()
    }

    async findOtp(email:string):Promise<IOtp | null>{
        return await Otp.findOne({email})
    }
}