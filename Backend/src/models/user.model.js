import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating an account"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Enter a valid email address'],
        unique: [true, "Email already exists"]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "more than 6 characters required"],
        select: fasle //whenever a query will be made this password will not be selected and send in the data unless it is explicitly mentioned
    }
}, {
    //sends the user data when it was created and updated
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return next()
})

const userModel = mongoose.model("user", userSchema)

export default userModel