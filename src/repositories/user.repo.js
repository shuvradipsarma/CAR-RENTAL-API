import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import { registerUser } from "../services/user.service";

// Add user to DB 
const addUser = asyncHandler(async(req,res)=>{
    registerUser(req.body)
})

export {addUser}