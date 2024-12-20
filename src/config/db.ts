import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URL!)
        console.log('DB is connected')
    } catch (err) {
        console.log("DB error"+err)    
    }
}

export default connectDB