import { Router } from "express";
import cookieParser from "cookie-parser";
import UsOrders from "../controllers/workWithCusContr";

const usOrders = Router();
usOrders.use(cookieParser());

usOrders.post("/order", UsOrders.tryCatch(UsOrders.CusVal), UsOrders.tryCatch(UsOrders.orderRims));
usOrders.post("/order-phcall", UsOrders.tryCatch(UsOrders.CusPhVal), UsOrders.tryCatch(UsOrders.orderAPhoneCall));
usOrders.post("/order-question", UsOrders.tryCatch(UsOrders.CusQuestVal), UsOrders.tryCatch(UsOrders.orderAQuestion));

export default usOrders;
