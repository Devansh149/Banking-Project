import express from 'express'
import registerController from '../controllers/auth.controller.js'
import authController from '../controllers/auth.controller.js';
const router=express.Router();

router.post("/register",registerController.registerUser)
router.post("/login",authController.loginController)

export default router  
