import cors from "cors";
import express from "express";
import compression from "compression";
import * as dotenv from "dotenv";
import carRtr from "./api/routers/carsRoutes";
import rimsRtr from "./api/routers/rimsRouter";
import searchRtr from "./api/routers/searchRouter";
import usrOrders from "./api/routers/usrOrdersRouter";
dotenv.config();

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("rims"));

app.use("/", carRtr);
app.use("/", rimsRtr);
app.use("/", searchRtr);
app.use("/", usrOrders);

app.listen(Number(process.env.PORT), () => {
	console.log(`Server is running...`);
});
