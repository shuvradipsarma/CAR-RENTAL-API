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

    // Check if a car with the same information already exists in the database
    const existingCar = await Car.findOne({
        where: {
            manufacturer,
            model,
            year,
            pricePerDay
        }
    });

    if (existingCar) {
        throw new ApiError(400, "Car already exists in the database!");
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

const updateCar = asyncHandler(async(req,res)=>{
    const {model, manufacturer, year, pricePerDay, isAvailability} = req.body;
    const carId = req.params.id

    // Validate carId
    if (!carId) {
        throw new ApiError(400, "Car ID is required");
    }

    // Fetch the car by carId
    const car = await Car.findOne({ carId });
    if (!car) {
        throw new ApiError(404, "Car not found");
    }

    // Update the existing car's fields
    if (model) car.model = model.trim();
    if (manufacturer) car.manufacturer = manufacturer.trim();
    if (pricePerDay != null) car.pricePerDay = pricePerDay;
    if (year) car.year = year;
    if (isAvailability != null) car.isAvailability = isAvailability;

    // Save changes to the database
    await car.save();

    // Send response with updated car details
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                carId: car.carId,
                model: car.model,
                manufacturer: car.manufacturer,
                pricePerDay: car.pricePerDay,
                year: car.year,
                isAvailability: car.isAvailability,
            },
            "Car information updated successfully!"
        )
    )
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
    const {userId,available} = req.query

    if([userId,available].some(value => value == null || value.trim() == ''))
    {
        throw new ApiError(400,"UserId & available fields are required")
    }
    
    const user = await User.findOne({userId})
     if(!user)
    {
        throw new ApiError(401,"User donot exist")
    }

    const availableCars = await Car.find({isAvailability: true})
    console.log(availableCars)
    if(availableCars == null)
    {
        throw new ApiError(404,"No cars are available, All are for rent")
    }

    return res.status(200).json({
        response: new ApiResponse(
            200,
            {    
                availableCars
            },
            "List of available cars for rent"
        )
    })
})

const deleteCar = asyncHandler(async(req,res)=>{
    const {carId} = req.params

    if (!carId || carId.trim() === '') {
        throw new ApiError(400, "Car ID is required");
    }

    const car = await Car.findByIdAndDelete(carId);

    if (!car) {
        throw new ApiError(404, "Car not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Car deleted successfully"
        )
    )
})

export {addCar, getCarById, getAvailableCars, deleteCar, updateCar}