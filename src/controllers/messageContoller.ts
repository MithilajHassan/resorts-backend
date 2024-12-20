import { Request, Response } from "express"
import CustomError from "../errors/customError"
import { IMessage } from "../models/messageModel"
import messageServices from "../services/messageServices"
import { CustomRequest } from "../middleware/auth"


class MessageController {

    async sendMessage(req: Request, res: Response) {
        try {
            const messageData : IMessage = req.body
            const message = await messageServices.sendMessage(messageData)
            res.status(200).json(message)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async getMessages(req: CustomRequest, res: Response) {
        try {
            let senderId = req.user?._id ? req.user._id : req.resort?._id           
            const conversation = await messageServices.getMessages(String(senderId), req.params.id)
            res.status(200).json(conversation)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async getConversationById(req: CustomRequest, res: Response) {
        try {          
            const conversation = await messageServices.getConversationById(req.params.id)
            res.status(200).json(conversation)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

    async getReceivers(req: CustomRequest, res: Response) {
        try {
            let senderId = req.user?._id ? req.user._id : req.resort?._id
            const conversation = await messageServices.getReceivers(String(senderId))
            res.status(200).json(conversation)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                console.error(err)
                res.status(500).json({ message: 'Internal Server Error' })
            }
        }
    }

}

export default new MessageController