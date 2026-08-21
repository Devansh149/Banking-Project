import userModel from "../models/user.model.js";
import jsonwebtoken from 'jsonwebtoken'
import emailService from "../services/email.service.js";

async function registerUser(req, res) {
    try {
        const { email, password, name } = req.body;

        const isUserExists = await userModel.findOne({ email });

        if (isUserExists) {
            return res.status(422).json({
                message: "Email already exists"
            });
        }

        const user = await userModel.create({
            email,
            password,
            name
        });

        const token = jsonwebtoken.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token);

        try {
            await emailService.sendRegistrationEmail(
                user.email,
                user.name
            );
        } catch (emailError) {
            console.error(
                "Welcome email failed:",
                emailError.message
            );
        }

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function loginController(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "User not found"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Enter valid password"
        })

    }
    const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            name: user.name

        }
    })


}

export default { registerUser, loginController }