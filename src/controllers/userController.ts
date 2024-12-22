import { Request, Response } from "express"
import userServices from "../services/userServices"
import CustomError from "../errors/customError"
import { CustomRequest } from "../middleware/auth"
import resortServices from "../services/resortServices"

export interface ResortQuery {
    place?: string;
    guestCount?: number;
    checkIn?: string;
    checkOut?: string;
    sortBy?: 'priceLowToHigh' | 'priceHighToLow' | 'rating';
    categories?: string;
    facilities?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
}

class UserController {

    async signup(req: Request, res: Response) {
        try {
            const { email } = req.body

            await userServices.handleUserSignup(email)

            res.status(200).json({ message: "OTP sent to your email", success: true })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            const { otp, name, email, password } = req.body

            const user = await userServices.verifyOtpAndCreate(otp, { name, email, password })

            res.status(201).json({ user, success: true })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body

            await userServices.handleUserSignup(email)

            res.status(200).json({ message: "OTP resent to your email", success: true })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async signin(req: Request, res: Response) {
        try {
            const { email, password, role } = req.body

            const user = await userServices.handleUserSignin(email, password, role, res)

            res.status(200).json({
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                avatar: user?.avatar,
            })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const { name, phone, avatar } = req.body;

        try {
            const updatedUser = await userServices.updateUser(id, { name, phone, avatar });
            res.status(200).json({
                id: updatedUser?._id,
                name: updatedUser?.name,
                email: updatedUser?.email,
                phone: updatedUser?.phone,
                avatar: updatedUser?.avatar
            });

        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }
    async updateUserPassword(req: Request, res: Response) {
        const { id } = req.params
        const { currPassword, newPassword } = req.body;

        try {
            await userServices.updatePassword(id, currPassword, newPassword);
            res.status(200).json({ success: true });
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async verifyUser(req: CustomRequest, res: Response) {
        try {
            const { _id, name, email, avatar, phone, isBlock } = req.user!

            res.status(200).json({
                _id,
                name,
                email,
                avatar,
                phone,
                isBlock,
            })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async signout(req: Request, res: Response) {
        try {
            res.cookie('userAccessT', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                expires: new Date(0),
            })
            res.cookie('userRefreshT', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                expires: new Date(0),
            })

            res.status(200).json({ message: "You are signed out", success: true })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async trendResorts(req: Request, res: Response) {
        try {
            const resorts = await userServices.findTrendResorts()
            res.status(200).json(resorts)
        } catch (error) {
            res.status(500).json({ message: 'Failed to get resorts', error })
        }
    }

    async resortDetails(req: Request, res: Response) {
        try {
            const { id } = req.params
            const resort = await userServices.resortDetails(id)
            res.status(200).json(resort)
        } catch (error) {
            res.status(500).json({ message: 'Failed to get resort Details', error })
        }
    }


    async searchRooms(req: Request, res: Response) {
        try {
            const {
                place, guestCount, checkIn, checkOut, sortBy, maxPrice, minPrice, categories, facilities, page
            }: ResortQuery = req.query 

            if (!place || !guestCount || !checkIn || !checkOut) {
                throw new CustomError("Missing required search parameters", 400);
            }          
            const response = await resortServices.searchRooms({
                place,
                guestCount: guestCount,
                checkIn,
                checkOut,
                sortBy,
                categories,
                facilities,
                minPrice,
                maxPrice,
                page
            });

            if (!response.availableRooms.length) {
                throw new CustomError("No available rooms found", 404);
            }

            return res.status(200).json({availableRooms:response.availableRooms,totalResorts:response.totalResorts});
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async walletDetails(req: CustomRequest, res: Response) {
        try {
            const histories = await userServices.walletDetails(req.user?._id as string)
            res.status(200).json({ balance: req.user?.walletBalance, histories })
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

}

export default new UserController