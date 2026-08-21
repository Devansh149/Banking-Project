import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Connected")
    }
    catch (err) {
        console.log(err);
        process.exit(1)
    }
}
export default connectDB  