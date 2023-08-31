import { Router } from "express";
import cookieParser from "cookie-parser";
import UsOrders from "../controllers/workWithCusContr";

const usrOrders = Router();
usrOrders.use(cookieParser());

usrOrders.post("/order", UsOrders.tryCatch(UsOrders.CusVal), UsOrders.tryCatch(UsOrders.orderRims));
usrOrders.post("/order-phcall", UsOrders.tryCatch(UsOrders.CusPhVal), UsOrders.tryCatch(UsOrders.orderAPhoneCall));
usrOrders.post("/order-question", UsOrders.tryCatch(UsOrders.CusQuestVal), UsOrders.tryCatch(UsOrders.orderAQuestion));

export default usrOrders;
