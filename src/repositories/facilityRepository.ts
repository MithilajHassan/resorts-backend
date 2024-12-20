
import { UpdateWriteOpResult } from 'mongoose'
import Facility, { IFacility } from './../models/facilityModel'


class FacilityRepository{
    async create(facilityName:string):Promise<IFacility>{
        const facility = new Facility({facilityName})
        return await facility.save()
    }

    async find():Promise<IFacility[]>{
        return await Facility.find({isDelete:false})
    }

    async findById(id:unknown):Promise<IFacility | null>{
        return await Facility.findById(id)
    }

    async findByName(name:string):Promise<IFacility | null>{
        return await Facility.findOne({facilityName:{$regex:'^'+ name +'$', $options:'i'}})
    }

    async delete(id:unknown):Promise<UpdateWriteOpResult>{
        return await Facility.updateOne({_id:id},{$set:{isDelete:true}})
    }

    async edit(id:unknown,name:string):Promise<IFacility | null>{
        return await Facility.findByIdAndUpdate(id,{$set:{facilityName:name}}, {new:true})
    }
}

export default new FacilityRepository