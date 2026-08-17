import mongoose from "mongoose";

async function connectDB() {
    try {
        console.log("DB Connected")
        await mongoose.connect(process.env.MONGO_URI)
    }
    catch (err) {
        console.log(err);
        process.exit(1)
    }
}
export default connectDB  