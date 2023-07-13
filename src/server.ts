import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
dotenv.config();
import carRtr from "./routers/carsRoutes";
import rimsRtr from "./routers/rimsRouter";
import searchRtr from "./routers/searchRouter";
import usOrders from "./routers/usOrdersRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET_COOKIES));
app.use(express.static("rims"));

app.use("/", carRtr);
app.use("/", rimsRtr);
app.use("/", searchRtr);
app.use("/", usOrders);

app.listen(Number(process.env.PORT), () => {
	console.log(`Server is running...`);
});
