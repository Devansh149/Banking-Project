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

async function loginController(req,res){
    const {email,password}=req.body
    const user=await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"User not found"
        })
    }
    
    const isValidPassword=await user.comparePassword(password)
     
    if(!isValidPassword){
        return res.status(401).json({
            message:"Enter valid password"
        })

    }
    const token=jsonwebtoken.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)

    return res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            email:user.email,
            name:user.name

        }
    })

    
}

export default { registerUser , loginController}
