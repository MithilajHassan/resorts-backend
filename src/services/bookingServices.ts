import BookingRepository from './../repositories/bookingRepository';
import { IBooking } from './../models/bookingModel';
import Razorpay from 'razorpay';
import userRepository from '../repositories/userRepository';
import walletHistoryRepository from '../repositories/walletHistoryRepository';
import CustomError from '../errors/customError';


class BookingService {
    async createBooking(bookingData: IBooking, walletBalance: number): Promise<{ orderId?: string, amount?: string | number, bookingId: string }> {
        if(bookingData.paymentMethod == 'wallet' && walletBalance < bookingData.totalPrice){
            throw new CustomError('Insufficient wallet balance',400)
        }
        const booking = await BookingRepository.createBooking(bookingData)
        if (bookingData.paymentMethod == 'upi') {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID!,
                key_secret: process.env.RAZORPAY_SECRET
            })
            const response = await razorpay.orders.create({
                amount: booking.totalPrice * 100,
                currency: 'INR',
                receipt: booking._id as string,
                payment_capture: true
            })
            return { orderId: response.id, amount: response.amount, bookingId: booking._id as string }
        }
        userRepository.updateUser(String(booking.userId),{walletBalance:walletBalance-booking.totalPrice})
        return { bookingId: booking._id as string }
    }

    async setPaymentStatus(id: string, status: boolean): Promise<IBooking | null> {
        return await BookingRepository.setPaymentStatus(id, status)
    }

    async getBookingById(id: string): Promise<IBooking | null> {
        return await BookingRepository.findBookingById(id);
    }

    async getBookingsByUserId(userId: string): Promise<IBooking[] | null> {
        return await BookingRepository.findByUserId(userId);
    }

    async getBookingsByResortId(resortId: string): Promise<IBooking[] | null> {
        return await BookingRepository.findByResortId(resortId);
    }

    async getAllBookings(): Promise<IBooking[]> {
        return await BookingRepository.findAll();
    }

    async updateBookingStatus(id: string, status: string): Promise<IBooking | null> {
        const booking = await BookingRepository.editBookingStatus(id, status);
        if (status == 'Cancelled') {
            await Promise.all([
                userRepository.updateUserWallet(String(booking?.userId!), booking?.totalPrice!),
                walletHistoryRepository.create({
                    userId: booking?.userId!,
                    amount: booking?.totalPrice!,
                    type: 'Refund',
                }),
            ])
        }
        return booking
    }
}

export default new BookingService()
