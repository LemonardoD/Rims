import { Response } from "express";
import { orderCall, orderMessage, orderQuestion } from "../services/telegramSender";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../types/otherDto";

class WorkWithCustomer {
	orderRims = async (req: OrderReqDTO, res: Response) => {
		await orderMessage(req, res);
	};

	orderAPhoneCall = async (req: OrderCallReqDTO, res: Response) => {
		await orderCall(req, res);
	};

	orderAQuestion = async (req: OrderQuestionReqDTO, res: Response) => {
		await orderQuestion(req, res);
	};
}

export default new WorkWithCustomer();
