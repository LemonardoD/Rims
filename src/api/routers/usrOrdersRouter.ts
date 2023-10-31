import { Router } from "express";
import UsOrders from "../controllers/workWithCusContr";
import Handler from "../helpers/handler";
import CustomerMidd from "../middlewares/workWithCusMidd";

const usrOrders = Router();

usrOrders.post("/rims", Handler.tryCatch(CustomerMidd.CusVal), Handler.tryCatch(UsOrders.orderRims));
usrOrders.post("/phone-call", Handler.tryCatch(CustomerMidd.CusPhVal), Handler.tryCatch(UsOrders.orderAPhoneCall));
usrOrders.post("/question", Handler.tryCatch(CustomerMidd.CusQuestVal), Handler.tryCatch(UsOrders.orderAQuestion));
export default usrOrders;
