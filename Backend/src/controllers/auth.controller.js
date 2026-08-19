import userModel from "../models/user.model.js";
import jsonwebtoken from 'jsonwebtoken'
async function registerUser(req, res) {
    const { email, password, name } = req.body
    const isUserExists =await userModel.findOne({
        email: email
    })
    if (isUserExists) {
        return res.status(422).json({
            message: "Email already exists"
        })
    }

    const user =await userModel.create({
        email,password,name
    })

    const token=jsonwebtoken.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)

    return res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            email:user.email,
            name:user.name

        }
    })
}

export default { registerUser }