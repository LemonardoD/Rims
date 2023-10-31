import { NextFunction, Response } from "express";
import Handler from "../helpers/handler";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../DTOs/otherDTOs";

class CusInfoMid {
	CusVal = async (req: OrderReqDTO, res: Response, next: NextFunction) => {
		const { name, phone, email } = req.body;
		if (!name || !phone || !email) Handler.error("Body with, name, phone, email, required!", 400);
		return next();
	};

	CusPhVal = async (req: OrderCallReqDTO, res: Response, next: NextFunction) => {
		const { phone } = req.body;
		if (!phone) Handler.error("Phone are required!", 400);
		return next();
	};

	CusQuestVal = async (req: OrderQuestionReqDTO, res: Response, next: NextFunction) => {
		const { question, phone } = req.body;
		if (!phone || !question) Handler.error("Phone & question are required!", 400);
		return next();
	};
}

export default new CusInfoMid();
