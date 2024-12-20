import { Router } from "express"
import { checkCarAvailability, rentCar } from "../services/rental.service.js"

const carRouter = Router()

carRouter.route("/check-available").get(checkCarAvailability)
carRouter.route("/rent").post(rentCar)
carRouter.route("/add-car")
export default carRouter;
