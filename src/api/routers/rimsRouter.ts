import { Router } from "express";
import RimInfo from "../controllers/rimInfoContr";

const rimsRtr = Router();

rimsRtr.get("/rims-popular", RimInfo.tryCatch(RimInfo.rimsPopular));

rimsRtr.post("/rim-by-id", RimInfo.tryCatch(RimInfo.rimIdVal), RimInfo.tryCatch(RimInfo.rimById));
rimsRtr.post("/rims-by-brand", RimInfo.tryCatch(RimInfo.rimsBrandVal), RimInfo.tryCatch(RimInfo.rimsByBrands));

export default rimsRtr;
