import { Request, Response } from 'express';
import BookingService from './../services/bookingServices';
import { IBooking } from './../models/bookingModel';
import { CustomRequest } from '../middleware/auth';
import CustomError from '../errors/customError';

class BookingController {

    async createBooking(req: CustomRequest, res: Response): Promise<void> {
        try {
            const bookingData: IBooking = req.body;
            const payment = await BookingService.createBooking(bookingData, req.user?.walletBalance!);
            res.status(201).json(payment)
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message })
            } else {
                res.status(500).json({ message: 'Error creating booking', err });
            }
        }
    }

    async setPaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId, status }: { bookingId: string, status: boolean } = req.body;

            await BookingService.setPaymentStatus(bookingId, status)

            res.status(201).json({ success: true })
        } catch (error) {
            res.status(500).json({ message: 'Error set payment status', error });
        }
    }

    async getBookingById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const booking = await BookingService.getBookingById(id);
            if (booking) {
                res.status(200).json(booking);
            } else {
                res.status(404).json({ message: 'Booking not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving booking', error });
        }
    }

    async getBookingsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            const bookings = await BookingService.getBookingsByUserId(userId);

            res.status(200).json({ bookings });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving bookings', error });
        }
    }

    async getBookingsByResortId(req: Request, res: Response): Promise<void> {
        try {
            const { resortId } = req.params;
            const bookings = await BookingService.getBookingsByResortId(resortId);
            res.status(200).json({ bookings });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving bookings', error });
        }
    }

    async getAllBookings(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await BookingService.getAllBookings();
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving bookings', error });
        }
    }

    async updateBookingStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const body: { status: string } = req.body;
            const updatedBooking = await BookingService.updateBookingStatus(id, body.status);
            res.status(200).json({ booking: updatedBooking })
        } catch (error) {
            res.status(500).json({ message: 'Error updating booking', error });
        }
    }
}

export default new BookingController()
