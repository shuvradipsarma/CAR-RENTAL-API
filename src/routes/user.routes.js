import { Router } from "express";
import { registerUser, authenticateUser } from "../services/user.service.js";
import { getUserByEmail, getUserById } from "../repositories/user.repo.js";

const userRouter = Router()

// Define routes
userRouter.route("/register").post(registerUser)
userRouter.route("/auth").post(authenticateUser)
userRouter.route("/user-details-id").get(getUserById)
userRouter.route("/user-details-email").get(getUserByEmail)

export default userRouter; 
