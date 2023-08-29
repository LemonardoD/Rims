import { NextFunction, Response } from "express";
import { Controller } from "../helpers/basicContrClass";
import { CustomError } from "../helpers/errThrower";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../DTOs/otherDTOs";

export class CusInfoMid extends Controller {
	CusVal = async (req: OrderReqDTO, res: Response, next: NextFunction) => {
		const { name, phone, email } = req.body;
		if (!name || !phone || !email) throw new CustomError("Body with, name, phone, email, required!", 406);
		next();
	};

	CusPhVal = async (req: OrderCallReqDTO, res: Response, next: NextFunction) => {
		const { phone } = req.body;
		if (!phone) throw new CustomError("Phone are required!", 406);
		next();
	};

	CusQuestVal = async (req: OrderQuestionReqDTO, res: Response, next: NextFunction) => {
		const { question, phone } = req.body;
		if (!phone || !question) throw new CustomError("Phone & question are required!", 406);
		next();
	};
}

export default new CusInfoMid();
