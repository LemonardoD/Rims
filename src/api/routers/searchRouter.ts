import { Router } from "express";
import CarInfo from "../controllers/carInfoContr";
import RimInfo from "../controllers/rimInfoContr";

const searchRtr = Router();

searchRtr.post("/search-by-config", RimInfo.tryCatch(RimInfo.rimConfigVal), RimInfo.tryCatch(RimInfo.rimByConfig));
searchRtr.post("/search-by-naming", RimInfo.tryCatch(RimInfo.rimNameVal), RimInfo.tryCatch(RimInfo.rimsByName));
searchRtr.post("/search-by-car", CarInfo.tryCatch(CarInfo.rimByCarVal), CarInfo.tryCatch(CarInfo.searchRimsByCar));

export default searchRtr;
