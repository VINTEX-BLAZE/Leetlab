// importing required modules
import express from "express"
import { RegisterUser, VerifyEmail, LogOut } from "./Auth.Controller.js"
import { validate } from "../../Middlewares/Auth.Middleware.js"
import { registerValidation } from "../../Utils/Auth.Validation.js"
import { IfLoggedIn } from "../../Middlewares/Auth.Middleware.js"

// Configuring the Router
const AuthRoutes = express.Router()

// Setting Up the Routes
AuthRoutes.post('/register', registerValidation(), validate, RegisterUser)
AuthRoutes.get(`/verify-email/:EmailVerificationToken`,  VerifyEmail)
AuthRoutes.post(`/Logout`,  IfLoggedIn ,LogOut)

export default AuthRoutes
