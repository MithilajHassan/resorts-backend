import mongoose, { Schema, Document, model } from 'mongoose';


export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    senderType: 'User' | 'Resort';
    receiverId: mongoose.Types.ObjectId;
    receiverType: 'User' | 'Resort';
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}


const MessageSchema: Schema = new Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath:'senderType' },
        senderType: { type: String, enum: ['User', 'Resort'], required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath:'receiverType' },
        receiverType: { type: String, enum: ['User', 'Resort'], required: true },
        message: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Message = model<IMessage>('Message', MessageSchema);

export default Message