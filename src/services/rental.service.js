import {Car} from "../models/car.model.js"
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// Car-Availability logic
const checkCarAvailability = asyncHandler(async(req,res)=>{
    const {carId} = req.body

    if(!carId)
    {
        throw new ApiError(400,"Car Id is required")
    }

    // Fetch the car from DB
    const car = Car.findById(carId)

    // check car availability in DB
    if(!car)
    {
        throw new ApiError(404,"Car not found")
    }

    // send the response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                carId: carId,
                isAvailability: car.isAvailability
            },
            car.isAvailability ? "Car is available" : "Car is not available"
        )
    )
})


// Rent-Car service logic
const rentCar = asyncHandler(async(req,res)=>{
    // de-structure info from json request
    const {email,carId,startDate,endDate,pricePerDay} = req.body

    // validate user inputs
    if([email,carId,startDate,endDate].some(value => value == null || value.trim() == ''))
    {
        throw new ApiError(400,"All fields are required")
    }

    // parse the duration of rental 
    const rentStart = new Date(startDate)
    const rentEnd = new Date(endDate)
    
    // check validity of start and ending dates
    if(rentEnd < startDate)
    {
        throw new ApiError(400," rental end date is greater than starting date!")
    }

    // check availability of car requested
    const car = Car.findById(carId) // get the carId from DB

    if(!car)
    {
        throw new ApiError(404,"car is unavailable for rent")
    }

    // calculate the total rental cost
    const rentalDays = Math.ceil((rentEnd - rentStart) / (1000 * 60 * 60 * 24))
    const totalPrice = rentalDays * car.pricePerDay

    // Initialize rentalHistory if undefined
    if (!Array.isArray(car.rentalHistory)) {
        car.rentalHistory = [];
    }

    // rent a car
    car.rentalHistory.push({
        email: email,
        startDate: rentStart,
        endDate: rentEnd,
        price: totalPrice
    })

    // update car's availability and add rentalHistory
    car.isAvailability = false
    
    // send the response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                email: email,
                carId: carId,
                startDate: rentStart,
                endDate: rentEnd,
                price: totalPrice
            }
        )
    )
})

export {checkCarAvailability,rentCar}