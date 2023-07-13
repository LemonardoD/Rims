import { Router } from "express";
import cookieParser from "cookie-parser";
import CarInfo from "../controllers/carInfoContr";

const carRtr = Router();
carRtr.use(cookieParser());

carRtr.get("/car-brands", CarInfo.tryCatch(CarInfo.allCarBrands));
carRtr.get("/car-models/:brand", CarInfo.tryCatch(CarInfo.carBrandVal), CarInfo.tryCatch(CarInfo.carModelsAndYears));

export default carRtr;
