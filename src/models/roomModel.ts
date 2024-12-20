import mongoose, { Document, model, ObjectId, Schema } from "mongoose"

export interface IRoom extends Document {
    resortId: ObjectId;
    name: string;
    numberOfGuests: number;
    totalRooms: number;
    normalPrice: number;
    offerPercentage: number;
    offerPrice?: number;
    isDeleted: boolean;
}

const roomSchema: Schema<IRoom> = new Schema({
    resortId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resort',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    numberOfGuests: {
        type: Number,
        required: true,
    },
    totalRooms: {
        type: Number,
        required: true,
    },
    normalPrice: {
        type: Number,
        required: true,
    },
    offerPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    offerPrice: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const Room = model<IRoom>('Room', roomSchema);

export default Room;