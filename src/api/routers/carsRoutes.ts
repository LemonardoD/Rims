import { Router } from "express";
import CarInfo from "../controllers/carInfoContr";
import Handler from "../helpers/handler";
import CarMiddle from "../middlewares/carInfoMidd";

const carRtr = Router();

carRtr.get("/brands", Handler.tryCatch(CarInfo.allCarBrands));
carRtr.get("/models/:brand", Handler.tryCatch(CarMiddle.carBrandVal), Handler.tryCatch(CarInfo.carModels));
carRtr.get("/years/:brand/:model", Handler.tryCatch(CarMiddle.carBrandAndModelVal), Handler.tryCatch(CarInfo.carYears));
carRtr.get("/config/:brand/:model/:year", Handler.tryCatch(CarMiddle.carBrModYrVal), Handler.tryCatch(CarInfo.carConfig));

export default carRtr;
