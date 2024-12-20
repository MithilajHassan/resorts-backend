import { UpdateWriteOpResult } from "mongoose"
import Category, { ICategroy } from "../models/categoryModel"


class CategoryRepository {
    async create(name: string): Promise<ICategroy> {
        const category = new Category({ name })
        return await category.save()
    }

    async find() {
        return await Category.find({ isDelete: false })
    }

    async findById(id: unknown): Promise<ICategroy | null> {
        return await Category.findById(id)
    }

    async findByName(name: string): Promise<ICategroy | null> {
        return await Category.findOne({ name: { $regex: '^' + name + '$', $options: 'i' }, isDelete: false })
    }
    async delete(id: unknown): Promise<UpdateWriteOpResult> {
        return await Category.updateOne({ _id: id }, { $set: { isDelete: true } })
    }
    async edit(id: unknown, name: string): Promise<ICategroy | null> {
        return await Category.findByIdAndUpdate(id, { $set: { name } }, { new: true })
    }
}

export default new CategoryRepository