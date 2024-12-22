import { Request, Response, NextFunction } from 'express'
import userRepository from '../repositories/userRepository';
import resortRepository from '../repositories/resortRepository';
import { IUser } from '../models/userModel';
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwtHelper';
import { IResort } from '../models/resortModel';


export interface CustomRequest extends Request {
    user?: Partial<IUser>;
    resort?:Partial<IResort>;
}

export const adminProtect = async (req: CustomRequest, res: Response, next: NextFunction) => {
    let accessToken = req.cookies?.adminAccessT
    const refreshToken = req.cookies?.adminRefreshT

    if (accessToken) {
        try {
            const decoded = verifyAccessToken(accessToken)
            const user = await userRepository.findById(decoded.id)

            if (user?.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized, invalid token' })
            }
            req.user = user
            next()
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    }else if (refreshToken) {
        try {
            const decodedRefresh = verifyRefreshToken(refreshToken)
            const user = await userRepository.findById(decodedRefresh.id);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            const newAccessToken = generateAccessToken({ id: user._id as string, role: user.role });
            res.cookie('adminAccessT', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                maxAge: 15 * 60 * 1000,
            });

            req.user = user
            next()
        } catch (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' })
    }
}

export const userProtect = async (req: CustomRequest, res: Response, next: NextFunction) => {
    let accessToken = req.cookies?.userAccessT
    let refreshToken = req.cookies?.userRefreshT

    if (accessToken) {
        try {
            const decoded = verifyAccessToken(accessToken)
            const user = await userRepository.findById(decoded.id)
            if (user?.role !== 'user') {
                return res.status(401).json({ message: 'Not authorized, invalid token' })
            } else if (user.isBlock) {
                return res.status(401).json({ messsage: 'Your account is blocked', isBlocked: user.isBlock })
            }
            req.user = user
            next()
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    }else if (refreshToken) {
        try {
            const decodedRefresh = verifyRefreshToken(refreshToken)
            const user = await userRepository.findById(decodedRefresh.id);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            const newAccessToken = generateAccessToken({ id: user._id as string, role: user.role });
            res.cookie('adminAccessT', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                maxAge: 15 * 60 * 1000,
            });

            req.user = user
            next()
        } catch (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    } else {
        res.status(401);
        return res.json({ message: 'Not authorized, no token' });
    }
}


export const userUnProtect = async (req: CustomRequest, res: Response, next: NextFunction) => {
    let accessToken = req.cookies?.userAccessT
    let refreshToken = req.cookies?.userRefreshT

    if (accessToken) {
        try {
            const decoded = verifyAccessToken(accessToken)
            const user = await userRepository.findById(decoded.id)
            if (user?.role !== 'user') {
                return res.status(401).json({ message: 'Not authorized, invalid token' })
            } else if (user.isBlock) {
                return res.status(401).json({ messsage: 'Your account is blocked', isBlocked: user.isBlock })
            }
            req.user = user
            next()
        } catch (error) {
            res.status(401);
            return res.json({ message: 'Not authorized, invalid token' });
        }
    }else if (refreshToken) {
        try {
            const decodedRefresh = verifyRefreshToken(refreshToken)
            const user = await userRepository.findById(decodedRefresh.id);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            const newAccessToken = generateAccessToken({ id: user._id as string, role: user.role });
            res.cookie('adminAccessT', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                maxAge: 15 * 60 * 1000,
            });

            req.user = user
            next()
        } catch (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    } else {
        next()
    }
}


export const resortProtect = async (req: CustomRequest, res: Response, next: NextFunction) => {
    let accessToken = req.cookies?.resortAccessT
    let refreshToken = req.cookies?.resortRefreshT


    if (accessToken) {
        try {
            const decoded = verifyAccessToken(accessToken)
            const resort = await resortRepository.findResortById(decoded.id)
            if (!resort) {
                return res.status(401).json({ message: 'Not authorized, invalid token' })
            } else if (resort.isBlock) {
                res.cookie('jwt', '', {
                    httpOnly: true,
                    expires: new Date(0),
                })
                return res.status(401).json({ messsage: 'Your account is blocked', isBlocked: resort.isBlock })
            }
            req.resort = resort 
            next()
        } catch (error) {
            res.status(401);
            return res.json({ message: 'Not authorized, invalid token' });
        }
    }else if (refreshToken) {
        try {
            const decodedRefresh = verifyRefreshToken(refreshToken)
            const resort = await resortRepository.findResortById(decodedRefresh.id);

            if (!resort) {
                return res.status(401).json({ message: 'User not found' });
            }

            const newAccessToken = generateAccessToken({ id: resort._id as string });
            res.cookie('resortAccessT', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                maxAge: 15 * 60 * 1000,
            });

            req.resort = resort
            next()
        } catch (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    } else {
        res.status(401);
        return res.json({ message: 'Not authorized, no token' });
    }
}
