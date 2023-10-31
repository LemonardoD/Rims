import "dotenv/config";
import cors from "cors";
import express from "express";
import compression from "compression";
import carRtr from "./api/routers/carsRoutes";
import rimsRtr from "./api/routers/rimsRouter";
import searchRtr from "./api/routers/searchRouter";
import usrOrders from "./api/routers/usrOrdersRouter";
import Handler from "./api/helpers/handler";
const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("rims"));
app.use(Handler.setCache);

app.use("/car", carRtr);
app.use("/rims", rimsRtr);
app.use("/search", searchRtr);
app.use("/order", usrOrders);

app.use(Handler.invalidPath);

app.listen(Number(process.env.PORT), () => {
	console.log(`Server is running...`);
});
