import { Router } from "express";
import cookieParser from "cookie-parser";
import CarInfo from "../controllers/carInfoContr";
import RimInfo from "../controllers/rimInfoContr";

const searchRtr = Router();
searchRtr.use(cookieParser());

searchRtr.get("/search-by-car", CarInfo.tryCatch(CarInfo.rimByCarVal), CarInfo.tryCatch(CarInfo.searchByCar));
searchRtr.get("/search-by-config", RimInfo.tryCatch(RimInfo.rimByConfig));
searchRtr.get("/search-by-naming", RimInfo.tryCatch(RimInfo.rimNameVal), RimInfo.tryCatch(RimInfo.rimsByName));

export default searchRtr;
