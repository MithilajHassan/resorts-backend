import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    resortId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    guestName: string;
    guestEmail: string;
    guestPhone: number;
    guestCount: number;
    checkInDate: Date;
    checkOutDate: Date;
    checkInTime: string;
    checkOutTime: string;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus?: boolean;
    status?: string;
    discount?: number;
    transactionId?: string;
}

const BookingSchema = new Schema<IBooking>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        resortId: { type: mongoose.Schema.Types.ObjectId, ref: "Resort", required: true },
        roomId: {type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        guestName: { type: String, required: true },
        guestEmail: { type: String, required: true },
        guestPhone: { type: Number, required: true },
        guestCount: { type: Number, required: true },
        checkInDate: { type: Date, required: true },
        checkOutDate: { type: Date, required: true },
        checkInTime: { type: String, required: true },
        checkOutTime: { type: String, required: true },
        totalPrice: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        paymentStatus: { type: Boolean, default: false },
        status: { type: String, enum:['Cancelled','Booked','Stayed'], default: 'Booked'},
        discount: { type: Number, required: false },
        transactionId: { type: String },
    },
    { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema)

export default Booking
