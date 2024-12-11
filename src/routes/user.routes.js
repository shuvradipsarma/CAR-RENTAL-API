import { Router } from "express";
import { registerUser, authenticateUser } from "../services/user.service.js";

const userRouter = Router();

// Define routes
userRouter.route("/register").post(registerUser);
userRouter.route("/auth").post(authenticateUser);

export default userRouter; 
