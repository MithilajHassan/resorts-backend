import { UpdateWriteOpResult } from 'mongoose';
import CustomError from '../errors/customError';
import { IRoom } from '../models/roomModel';
import roomRepository from '../repositories/roomRepository';

export default new class ResortService {

    async createRoom(roomData: IRoom): Promise<IRoom> {
        const exist = await roomRepository.findByname(roomData.name,roomData.resortId)
        if (exist) {
            throw new CustomError('Room is already exist', 409)
        }
        roomData.offerPrice = roomData.normalPrice - Math.floor((roomData.normalPrice * roomData.offerPercentage)/100)
        
        return await roomRepository.createRoom(roomData)
    }

    async editRoom(id:string, roomData: IRoom): Promise<IRoom | null> {
        const exist = await roomRepository.findByname(roomData.name,roomData.resortId)
        if (exist && exist.name != roomData.name) {
            throw new CustomError('Room is already exist', 409)
        }
        if(exist?.offerPercentage != roomData.offerPercentage || exist?.normalPrice != roomData.normalPrice){
            roomData.offerPrice = roomData.normalPrice - Math.floor((roomData.normalPrice * roomData.offerPercentage)/100)
        }
        
        return await roomRepository.editRoom(id,roomData)
    }

    async deleteRoom(roomId: string): Promise<UpdateWriteOpResult> {
        return await roomRepository.deleteRoom(roomId)
    }

    async getRoomsByResortId(resortId: string): Promise<IRoom[] | null> {
        return await roomRepository.findRoomsByResortId(resortId)
    }

    async getRoomsById(id: string): Promise<IRoom | null> {
        return await roomRepository.findRoomById(id)
    }

}