import { UpdateWriteOpResult } from 'mongoose'
import Room, { IRoom } from '../models/roomModel'
import Booking from '../models/bookingModel'

export default new class RoomRepository {
    async createRoom(roomData: IRoom): Promise<IRoom> {
        const newRoom = new Room(roomData)
        return await newRoom.save()
    }

    async findRoomsByResortId(resortId: string): Promise<IRoom[] | []> {
        return await Room.find({ resortId, isDeleted: false })
    }

    async findRoomById(id: string): Promise<IRoom | null> {
        return await Room.findById(id)
    }

    async findRooms(id: String): Promise<IRoom[] | null> {
        return await Room.find({ resortId: id, isDeleted: false })
    }

    async editRoom(id: string, roomData: IRoom): Promise<IRoom | null> {
        return await Room.findByIdAndUpdate(id, { $set: roomData }, { new: true })
    }

    async deleteRoom(id: unknown): Promise<UpdateWriteOpResult> {
        return await Room.updateOne({ _id: id }, { $set: { isDeleted: true } })
    }

    async findByname(name: string, resortId: unknown): Promise<IRoom | null> {
        return await Room.findOne({ name: { $regex: '^' + name + '$', $options: 'i' }, resortId, isDeleted: false })
    }

    async findAvailableRooms(resortId: string, guestCount: number, checkIn: Date, checkOut: Date): Promise<IRoom[] | null> {
        const roomBookings = await Booking.find({
            resortId,
            $or: [
              { checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } }
            ],
            paymentStatus: true,
          });
        
          const bookedRoomIds = roomBookings.map((booking) => booking.roomId);
        
          return Room.find({
            resortId,
            numberOfGuests: { $gte: guestCount },
            isDeleted: false,
            _id: { $nin: bookedRoomIds }, 
          })
    }

}