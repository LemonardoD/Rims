import { Router } from "express";
import CarInfo from "../controllers/carInfoContr";
import RimInfo from "../controllers/rimInfoContr";
import Handler from "../helpers/handler";
import rimsMidd from "../middlewares/rimsInfoMidd";
import CarMidd from "../middlewares/carInfoMidd";

const searchRtr = Router();

searchRtr.param("searchText", Handler.tryCatch(rimsMidd.rimNameVal));
searchRtr.get("/by-naming/:searchText", Handler.tryCatch(RimInfo.rimsByName));

searchRtr.post("/by-config", Handler.tryCatch(rimsMidd.rimConfigVal), Handler.tryCatch(RimInfo.rimByConfig));
searchRtr.post("/by-car", Handler.tryCatch(CarMidd.rimByCarVal), Handler.tryCatch(CarInfo.searchRimsByCar));

export default searchRtr;
