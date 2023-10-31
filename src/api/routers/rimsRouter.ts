import { Router } from "express";
import RimInfo from "../controllers/rimInfoContr";
import Handler from "../helpers/handler";
import rimsMidd from "../middlewares/rimsInfoMidd";

const rimsRtr = Router();

rimsRtr.param("id", Handler.tryCatch(rimsMidd.rimIdVal));
rimsRtr.param("brand", Handler.tryCatch(rimsMidd.rimsBrandVal));

rimsRtr.get("/popular", Handler.tryCatch(RimInfo.rimsPopular));
rimsRtr.get("/by-id/:id", Handler.tryCatch(RimInfo.rimById));
rimsRtr.get("/by-brand/:brand", Handler.tryCatch(RimInfo.rimsByBrands));

export default rimsRtr;
