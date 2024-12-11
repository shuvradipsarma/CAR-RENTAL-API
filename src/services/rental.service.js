import {Car} from "../models/car.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// Rent-Car service logic
const rentCar = asyncHandler(async(req,res)=>{
    // de-structure info from json request
    const {userId,carId,startDate,endDate} = req.body

    // validate user inputs
    if([userId,carId,startDate,endDate].some(value => value == null || value.trim() == ''))
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
    const rentalDays = Math.ceil((rentalEnd - rentalStart) / (1000 * 60 * 60 * 24))
    const totalPrice = rentalDays * car.pricePerDay

    // update car's availability and add rentalHistory
    car.isAvailability = false
    car.rentalHistory.push({
        userId,
        startDate: rentStart,
        endDate: rentEnd,
        totalPrice
    })

    // send the response
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: userId,
                carId: carId,
                startDate: rentStart,
                endDate: rentEnd,
                price: totalPrice
            }
        )
    )
})