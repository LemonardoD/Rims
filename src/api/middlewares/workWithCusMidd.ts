import { NextFunction, Response } from "express";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../types/otherDto";
import Handler from "../helpers/handler";

class CusInfoMid {
	CusVal = async (req: OrderReqDTO, res: Response, next: NextFunction) => {
		const { name, phone, email } = req.body;
		if (!name || !phone || !email) Handler.throwError("Body with, name, phone, email, required!", 400);
		return next();
	};

	CusPhVal = async (req: OrderCallReqDTO, res: Response, next: NextFunction) => {
		const { phone } = req.body;
		if (!phone) Handler.throwError("Phone are required!", 400);
		return next();
	};

	CusQuestVal = async (req: OrderQuestionReqDTO, res: Response, next: NextFunction) => {
		const { question, phone } = req.body;
		if (!phone || !question) Handler.throwError("Phone & question are required!", 400);
		return next();
	};
}

export default new CusInfoMid();
