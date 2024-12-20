import mongoose, { Schema, Document, model } from 'mongoose';


export interface IConversation extends Document {
    participants: Array<{ participantId: mongoose.Types.ObjectId; participantType: 'User' | 'Resort' }>;
    messages: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}


const ConversationSchema: Schema = new Schema(
    {
        participants: [
            {
                participantId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'participants.participantType' },
                participantType: { type: String, enum: ['User', 'Resort'], required: true },
            },
        ],
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: [] }],
    },
    {
        timestamps: true,
    }
);


const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation