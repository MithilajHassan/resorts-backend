import bcrypt from 'bcrypt'
import { IUser } from "../models/userModel"
import userRepository from "../repositories/userRepository"
import CustomError from '../errors/customError'
import otpServices from "./otpServices"
import { Response } from 'express'
import resortRepository from '../repositories/resortRepository'
import { IResort } from '../models/resortModel'
import { generateAccessToken, generateRefreshToken } from '../utils/jwtHelper'
import bookingRepository from '../repositories/bookingRepository'
import { IWalletHistory } from '../models/walletHistoryModel'
import walletHistoryRepository from '../repositories/walletHistoryRepository'

class UserServices {
    async handleUserSignup(email: string) {
        const existEmail = await userRepository.findByEmail(email)
        if (existEmail) {
            throw new CustomError('Email already exists', 400)
        }
        const otp = otpServices.generateOtp()
        await otpServices.createOtp({ email, otp })
        otpServices.sendOtpVerificationEmail(email, otp)
    }

    async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return await userRepository.updateUser(id, data);
    }

    async updatePassword(id: string, currPassword: string, newPassword: string): Promise<IUser | null> {
        const user = await userRepository.findById(id)
        if(!(await bcrypt.compare(currPassword,user?.password!))){
            throw new CustomError('Current password is wrong',400)
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword,salt)
        return await userRepository.updatePassword(id, hashedPassword);
    }

    async verifyOtpAndCreate(otp: string, userData: Partial<IUser>): Promise<IUser> {
        const savedOtp = await otpServices.findOtp(userData.email!)
        if (!savedOtp) {
            throw new CustomError('OTP code expired', 403)
        }

        if (savedOtp.otp !== otp) {
            throw new CustomError('OTP is incorrect', 401)
        }

        return await userRepository.create(userData)
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await userRepository.findById(id)
    }

    async handleUserSignin(email: string, password: string, role: string, res: Response): Promise<IUser | undefined> {
        const user = await userRepository.findByEmail(email)
        if (!user) {
            throw new CustomError('Invalid Email', 401)
        }

        if (user?.password && await bcrypt.compare(password, user?.password) ) { 
            if (user.isBlock) {
                throw new CustomError('Your account is blocked', 403)
            } else {
                const accessToken = generateAccessToken({ id: user._id as string, role: user.role })
                const refreshToken = generateRefreshToken(user._id as string)

                if (role == 'user') {
                    if (user.role != role) {
                        throw new CustomError('Invalid Email', 401)
                    }
                    res.cookie('userRefreshT', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'none',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    })
                    res.cookie('userAccessT', accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'none',
                        maxAge: 15 * 60 * 1000,
                    })
                } else if (role == 'admin') {
                    if (user.role != role) {
                        throw new CustomError('You are not an admin', 401)
                    }
                    res.cookie('adminRefreshT', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'none',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    })
                    res.cookie('adminAccessT', accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'none',
                        maxAge: 15 * 60 * 1000,
                    })
                }

                return user
            }
        } else {
            throw new CustomError('Invalid password', 401)
        }
    }

    async findTrendResorts(): Promise<IResort[]> {
        const mostBookings = await bookingRepository.findMostBookings()
        const resorts:IResort[] = []
        for(let x of mostBookings){
            let resort = await resortRepository.findVerifiedResort(x._id)
            if(resort != null){
                resorts.push(resort)
            }
        }
        return resorts
    }
    async resortDetails(id: string): Promise<IResort | null> {
        return await resortRepository.findResortById(id)
    }

    async walletDetails(userId: string):Promise<IWalletHistory[] | []>{
        return await walletHistoryRepository.findHistories(userId)
    }


}

export default new UserServices()