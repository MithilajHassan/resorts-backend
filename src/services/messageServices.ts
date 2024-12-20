import { IConversation } from "../models/conversationModel";
import { IMessage } from "../models/messageModel";
import conversationRepositroy from "../repositories/conversationRepositroy";
import messageRepository from "../repositories/messageRepository";

export default new class MessageServices {

    async sendMessage(messageData: IMessage): Promise<IMessage> {

        let conversation = await conversationRepositroy.getConversationByParticipants(String(messageData.senderId), String(messageData.receiverId))

        if (!conversation) {
            conversation = await conversationRepositroy.createConversation([
                { participantId: messageData.senderId, participantType: messageData.senderType },
                { participantId: messageData.receiverId, participantType: messageData.receiverType }
            ])
        }

        const newMessage = await messageRepository.createMessage(messageData)
        
        await conversationRepositroy.addMessageToConversation(conversation._id as string,newMessage._id as string)

        return newMessage;
    }

    async getMessages(senderId:string,receiverId:string): Promise<IConversation | null> {

        let conversation = await conversationRepositroy.getConversationByParticipants(senderId, receiverId)

        return conversation;
    }

    async getConversationById(id:string): Promise<IConversation | null> {

        let conversation = await conversationRepositroy.getConversationById(id)

        return conversation;
    }

    async getReceivers(participantId:string): Promise<IConversation[]> {

        let conversation = await conversationRepositroy.getConversationsByParticipantId(participantId)

        return conversation;
    }



    
}