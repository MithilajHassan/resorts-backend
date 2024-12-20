import { FilterQuery } from 'mongoose';
import Booking, { IBooking } from './../models/bookingModel';

export default new class BookingRepository {
    async createBooking(BookingData: IBooking): Promise<IBooking> {
        const newBooking = new Booking(BookingData)
        return await newBooking.save()
    }

    async findBookingById(id: string): Promise<IBooking | null> {
        return await Booking.findById(id).populate('userId').populate('resortId').populate('roomId')
    }

    async findByUserId(id: string): Promise<IBooking[] | null> {
        return await Booking.find({userId:id}).populate('resortId').populate('roomId')
    }

    async findMostBookings():Promise<{_id:string,count:number}[]>{
        return await Booking.aggregate<{_id:string,count:number}>([
            {
              $group: {
                _id: "$resortId",
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                count: -1
              }
            },
            {
              $limit: 5
            }
          ])
    }

    async findByResortId(id: string): Promise<IBooking[] | null> {
        return await Booking.find({resortId:id}).populate('userId').populate('roomId').populate('resortId')
    }

    async findAll(filter:FilterQuery<IBooking>={}): Promise<IBooking[] | []> {
        return await Booking.find(filter)
    }

    async editBookingStatus(id: string , status: string): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(id, { $set: { status } }, { new: true }).populate('resortId').populate('roomId')
    }

    async setPaymentStatus(id:string, status:boolean): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(id, { $set: {paymentStatus:status} }, { new: true })
    }
    

}