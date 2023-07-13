import { Router } from "express";
import cookieParser from "cookie-parser";
import RimInfo from "../controllers/rimInfoContr";

const rimsRtr = Router();
rimsRtr.use(cookieParser());

rimsRtr.get("/rims-configs", RimInfo.tryCatch(RimInfo.rimConfigs));
rimsRtr.get("/rims-popular", RimInfo.tryCatch(RimInfo.rimsPopular));
rimsRtr.get("/rim-by-id", RimInfo.tryCatch(RimInfo.rimIdVal), RimInfo.tryCatch(RimInfo.rimById));
rimsRtr.get("/rims-by-brand", RimInfo.tryCatch(RimInfo.rimsBrandVal), RimInfo.tryCatch(RimInfo.rimsByBrands));

export default rimsRtr;
