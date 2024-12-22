import { Router } from "express"
import { checkCarAvailability, rentCar } from "../services/rental.service.js"
import { addCar, getCarById } from "../repositories/car.repo.js"

const carRouter = Router()

carRouter.route("/check-available").get(checkCarAvailability)
carRouter.route("/rent").post(rentCar)
carRouter.route("/add-car").post(addCar)
carRouter.route("get-car-by-id").get(getCarById)

export default carRouter;
