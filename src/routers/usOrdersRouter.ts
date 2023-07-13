import { Router } from "express";
import cookieParser from "cookie-parser";
import UsOrders from "../controllers/workWithCusContr";

const usOrders = Router();
usOrders.use(cookieParser());

usOrders.get("/order", UsOrders.tryCatch(UsOrders.CusVal), UsOrders.tryCatch(UsOrders.order));
usOrders.get("/order-phcall", UsOrders.tryCatch(UsOrders.CusPhVal), UsOrders.tryCatch(UsOrders.orderAPhoneCall));
usOrders.get("/order-question", UsOrders.tryCatch(UsOrders.CusQuestVal), UsOrders.tryCatch(UsOrders.orderQuestion));

export default usOrders;
