import Conversation, { IConversation } from "../models/conversationModel";

export default new class ConversationRepository {
    async createConversation(participants: IConversation["participants"]): Promise<IConversation> {
        const conversation = new Conversation({ participants });
        return conversation.save()
    }

    async getConversationByParticipants(id1: string,id2: string): Promise<IConversation | null> {
        return Conversation.findOne({
            participants:{$all:[
                { $elemMatch: { participantId: id1 } },
                { $elemMatch: { participantId: id2 } }
            ]}
        }).populate('messages')
    }

    async getConversationById(id: string): Promise<IConversation | null> {
        return Conversation.findOne({_id:id}).populate('messages')
    }

    async addMessageToConversation(conversationId: string, messageId: string): Promise<IConversation | null> {
        return Conversation.findByIdAndUpdate(
            conversationId,
            { $push: { messages: messageId } },
            { new: true }
        );
    }

    async getConversationsByParticipantId(participantId: string): Promise<IConversation[]> {
        return Conversation.find({
            participants: { $elemMatch: { participantId } },
        }).populate('participants.participantId')
    }
}