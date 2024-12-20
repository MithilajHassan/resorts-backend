import { Document, model, Schema } from "mongoose";

export interface ICategroy extends Document {
    name: string;
    isDelete?: boolean
}

const categorySchema = new Schema<ICategroy>({
    name: {
        type: String,
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
})

const Category = model<ICategroy>('Category', categorySchema)
export default Category