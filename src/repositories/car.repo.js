import { Car } from "../models/car.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// Add car to DB
const addCar = asyncHandler(async(req,res)=>{
    // de-structure info about Car from json req.body
    const {manufacturer, model, year, pricePerDay, isAvailability} = req.body
    
    // validity check 
    if([manufacturer, model, year, pricePerDay, isAvailability],some(value => value == null || value.trim() == ''))
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

    // set the car-availability, isAvailability defaults to true if not explicitly provided.
    if(req.body.isAvailability !== undefined) // strict inequality check
    {
        isAvailability = req.body.isAvailability // use value provided in req body 
    }
    else
    {
        isAvailability = true // set the default value
    }

    // create the car object 
    const car = new Car.create({
        manufacturer,
        model,
        year,
        pricePerDay,
        isAvailability
    })

    return req.status(201).json({
        response: new ApiResponse(
            201,
            car,
            "Car added successfully"
        )
    })
})

export {addCar}