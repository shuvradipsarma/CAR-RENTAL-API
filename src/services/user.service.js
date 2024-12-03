import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from jsonwebtoken

const registerUser = asyncHandler(async(req,res)=>{
    // de-structure info from json req 
    const {name,email,password} = req.body

    // required fields validation(empty or null check)
    if([name,email,password].some(value => value == null || value.trim() === '')){
        throw new ApiError(400,"All fields are required")
    }

    // email format validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))
    {
        throw new ApiError(400,"Email format incorrect!")
    }

    // password length validation check
    if(password.length < 6)
    {
        throw new ApiError(400,"Password must be of atleast 6 characters long!")
    }

    // Hash the user password
    // Hashing takes time
    const hashedPassword = await bcrypt.hash(password,10)

    // Check if user already exists or not
    const existedUser = User.findOne({
        $or:[{name},{email}]
    })

    // User already exists
    if(existedUser)
    {
        throw new ApiError(400, "User already exists")
    }

    // If new user then add their details to DB
    const user = new User({
        name,
        email,
        password:hashedPassword
    })
})

