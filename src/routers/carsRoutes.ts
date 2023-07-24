import { Router } from "express";
import cookieParser from "cookie-parser";
import CarInfo from "../controllers/carInfoContr";

const carRtr = Router();
carRtr.use(cookieParser());

carRtr.get("/car-news/:offset", CarInfo.tryCatch(CarInfo.carNews));
carRtr.get("/car-brands", CarInfo.tryCatch(CarInfo.allCarBrands));
carRtr.get("/car-models/:brand", CarInfo.tryCatch(CarInfo.carBrandVal), CarInfo.tryCatch(CarInfo.carModels));
carRtr.get("/car-years/:brand/:model", CarInfo.tryCatch(CarInfo.carBrandAndModelVal), CarInfo.tryCatch(CarInfo.carYears));
carRtr.get("/car-config/:brand/:model/:year", CarInfo.tryCatch(CarInfo.carBrModYrVal), CarInfo.tryCatch(CarInfo.carConfig));
export default carRtr;
