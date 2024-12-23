import { Car } from "../models/car.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

// Add car to DB
const addCar = asyncHandler(async(req,res)=>{
    // de-structure info about Car from json req.body
    const {manufacturer, model, year, pricePerDay, isAvailability} = req.body
    
    // validity check 
    if([manufacturer, model, year, pricePerDay, isAvailability].some(value => value == null || value.trim() == ''))
    {
        throw new ApiError(400,"All fields are required")
    }

    // check year validity 
    if(year < 1886 || year > new Date().getFullYear())
    {
        throw new ApiError(400,"Invalid Year. Enter between 1886 and Current Year!")
    }

    if(pricePerDay < 0)
    {
        throw new ApiError(400,"Price per day cannot be negative!")
    }

    var carAvailability;

    // set the car-availability, isAvailability defaults to true if not explicitly provided.
    if(req.body.isAvailability !== undefined) // strict inequality check
    {
        carAvailability = req.body.isAvailability // use value provided in req body 
    }
    else
    {
        carAvailability = true // set the default value
    }

    // create the car object 
    const car = await Car.create({
        manufacturer,
        model,
        year,
        pricePerDay,
        isAvailability: carAvailability
    })

    return res.status(201).json({
        response: new ApiResponse(
            201,
            car,
            "Car added successfully"
        )
    })
})

// Get Car by its Id
const getCarById = asyncHandler(async(req,res)=>{
    const {carId} = req.query

    if(carId == null || carId.trim() == '')
    {
        throw new ApiError(400,"Car Id field required")
    }
    
    const car = await Car.findOne({carId})

    if(!car)
    {
        throw new ApiError(404,"Car Id donot exists")
    }

    return res.status(200).json({
        response: new ApiResponse(
            200,
            car,
            "Car found successfully"
        )
    })
})

const getAvailableCars = asyncHandler(async(req,res)=>{
    const {userId} = req.query

    if(userId == null || userId.trim() == '')
    {
        throw new ApiError(400,"UserId is required")
    }

    const user = User.findOne({userId})

    if(!user)
    {
        throw new ApiError(401,"User donot exist")
    }

    const availableCars = await Car.find({isAvailability:true}) // await since DB call 
    return res.status(200).json({
        response: new ApiResponse(
            200,
            {
                availableCars: availableCars
            },
            "List of available cars for rent"
        )
    })
})

export {addCar,getCarById,getAvailableCars}