import cors from "cors";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import carRtr from "./routers/carsRoutes";
import rimsRtr from "./routers/rimsRouter";
import searchRtr from "./routers/searchRouter";
import usrOrders from "./routers/usrOrdersRouter";
dotenv.config();

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_COOKIES));
app.use(express.static("rims"));

app.use("/", carRtr);
app.use("/", rimsRtr);
app.use("/", searchRtr);
app.use("/", usrOrders);

app.listen(Number(process.env.PORT), () => {
	console.log(`Server is running...`);
});
