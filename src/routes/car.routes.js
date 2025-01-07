import { Router } from "express"
import {getAvailableCarsController,addCarController,updateCarController,deleteCarController,checkCarAvailabilityController,rentCarController,getCarByIdController} from "../controllers/car.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const carRouter = Router()

// Define routes
carRouter.route("/addCar").post(verifyJWT,addCarController)
carRouter.route("/rent").post(verifyJWT,rentCarController)
carRouter.route("/checkAvailableCars").get(verifyJWT,checkCarAvailabilityController)
carRouter.route("/listAvailableCars").get(verifyJWT,getAvailableCarsController)
carRouter.route("/updateCar").patch(verifyJWT,updateCarController)
carRouter.route("/deleteCar").delete(verifyJWT,deleteCarController)
carRouter.route("/getCarById").get(verifyJWT,getCarByIdController)

export default carRouter


// import { Router } from "express"
// import { checkCarAvailability, rentCar } from "../services/rental.service.js"
// import { addCar, getAvailableCars, getCarById } from "../repositories/car.repo.js"

// const carRouter = Router()

// carRouter.route("/check-available").get(checkCarAvailability)
// carRouter.route("/rent").post(rentCar)
// carRouter.route("/add-car").post(addCar)
// carRouter.route("/get-car-by-id").get(getCarById)
// carRouter.route("/available-cars").get(getAvailableCars)

// export default carRouter;
