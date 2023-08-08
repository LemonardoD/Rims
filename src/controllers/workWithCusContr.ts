import { Response } from "express";
import { CusInfoMid } from "../middlewares/workWithCusMidd";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../DTOs/otherDTOs";
import EmSender from "../services/emailSender";

class WorkWithCustomer extends CusInfoMid {
	order = async (req: OrderReqDTO, res: Response) => {
		const { name, phone, email, orderConfig } = req.body;
		await EmSender.sendEmailToCusOrder(email);
		await EmSender.sendEmailToAdminOrder(phone, name, orderConfig);
		return this.response(200, "Order is processing.", res);
	};

	orderAPhoneCall = async (req: OrderCallReqDTO, res: Response) => {
		await EmSender.sendEmailToAdminPhCall(req.body.phone);
		return this.response(200, "Phone call is processing.", res);
	};

	orderAQuestion = async (req: OrderQuestionReqDTO, res: Response) => {
		const { question, phone, email } = req.body;
		if (email) {
			await EmSender.sendEmailToCusOrderAnswerQuestion(email);
		}
		await EmSender.sendEmailToAdminAnswerQuestion(phone, question);
		return this.response(200, "Answer is processing.", res);
	};
}

export default new WorkWithCustomer();
