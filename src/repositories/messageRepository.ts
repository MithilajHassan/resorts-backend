import Message, { IMessage } from "../models/messageModel";

export default new class MessageRepository {
    async createMessage(data: IMessage): Promise<IMessage> {
        const message = new Message(data);
        return message.save();
    }

    async getMessageById(messageId: string): Promise<IMessage | null> {
        return Message.findById(messageId);
    }

    async getMessagesByConversation(conversationId: string): Promise<IMessage[]> {
        return Message.find({ conversationId })
    }
}

