import { Request, Response } from "express"
import CustomError from "../errors/customError"
import adminServices from "../services/adminServices"


class AdminController {

    async signout(req: Request, res: Response) {
        try {
            res.cookie('adminAccessT', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                expires: new Date(0),
            })
            res.cookie('adminRefreshT', '', {
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

    async addCategory(req: Request, res: Response) {
        try {
            const { category } = req.body
            const categoryDetails = await adminServices.addCategory(category)
            res.status(200).json({ category: categoryDetails, success: true })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async listCategories(req: Request, res: Response) {
        try {
            const categories = await adminServices.listCategories()

            res.status(200).json(categories)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }
    async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params
            const result = await adminServices.deleteCategory(id)
            if (result.acknowledged) {
                res.status(200).json({ success: true })
            } else {
                res.status(400).json({ success: false })
            }
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async editCategory(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { category } = req.body
            const categoryData = await adminServices.editCategory(id, category)
            if (categoryData) {
                res.status(200).json({ success: true, category: categoryData })
            } else {
                res.status(400).json({ success: false })
            }
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    //---------------------- facility Management -----------------------------------//

    async addFacility(req: Request, res: Response) {
        try {
            const { facilityName } = req.body
            const facilityDetails = await adminServices.addFacility(facilityName)
            res.status(200).json({ facility: facilityDetails, success: true })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async listFacilities(req: Request, res: Response) {
        try {
            const facilities = await adminServices.listFacilities()

            res.status(200).json(facilities)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async deleteFacility(req: Request, res: Response) {
        try {
            const { id } = req.params
            const result = await adminServices.deleteFacility(id)
            if (result.acknowledged) {
                res.status(200).json({ success: true })
            } else {
                res.status(400).json({ success: false })
            }
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async editFacility(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { facilityName } = req.body

            const facility = await adminServices.editFacility(id, facilityName)
            if (facility) {
                res.status(200).json({ success: true, facility })
            } else {
                res.status(400).json({ success: false })
            }
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }
    //---------------------- Resort Management -----------------------------------//

    async listResorts(req: Request, res: Response) {
        try {
            const resorts = await adminServices.listResorts()

            res.status(200).json(resorts)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async acceptResort(req: Request, res: Response) {
        try {
            const { id } = req.params
            const resort = await adminServices.acceptResort(id)

            res.status(200).json({ success: true, resort })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async rejectResort(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { reason } = req.body

            const resort = await adminServices.rejectResort(id, reason)

            res.status(200).json({ success: true, resort })
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async manageResortBlock(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { status } = req.body
            const resort = await adminServices.manageResortBlock(id, status)
            res.status(200).json({ success: true, resort })
        } catch (error) {
            res.status(500).json({ message: 'Failed to get Resort', error })
        }
    }

    //---------------------- User Management -----------------------------------//

    async manageUserBlock(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { status } = req.body
            await adminServices.manageUserBlock(id, status)
            res.status(200).json({ success: true })
        } catch (error) {
            res.status(500).json({ message: 'Failed to get user', error })
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            const users = await adminServices.listUsers()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({ message: 'Failed to get users', error })
        }
    }


    async getChartDetails(req: Request, res: Response) {
        try {
            const chartDetails = await adminServices.findTrendResorts()
            res.status(200).json(chartDetails)
        } catch (error) {
            res.status(500).json({ message: 'Failed to get details', error })
        }
    }

    async getTailsDetails(req: Request, res: Response) {
        try {
            const tailsDetails = await adminServices.getTailsDetails()
            res.status(200).json(tailsDetails)
        } catch (error) {
            res.status(500).json({ message: 'Failed to get details', error })
        }
    }

}

export default new AdminController