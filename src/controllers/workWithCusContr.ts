import { Response } from "express";
import { CusInfoMid } from "../middlewares/workWithCusMidd";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../DTOs/middlewareDTOs";
import EmSender from "../services/emailSender";

class WorkWithCustomer extends CusInfoMid {
	order = async (req: OrderReqDTO, res: Response) => {
		const { name, phone, email } = req.body;
		await EmSender.sendEmailToCusOrder(email);
		await EmSender.sendEmailToAdminOrder(phone, name);
		return this.response(200, "Order in processing.", res);
	};

	orderAPhoneCall = async (req: OrderCallReqDTO, res: Response) => {
		const { phone } = req.body;
		await EmSender.sendEmailToAdminPhCall(phone);
		return this.response(200, "Phone call in processing.", res);
	};

	orderQuestion = async (req: OrderQuestionReqDTO, res: Response) => {
		const { question, phone, email } = req.body;
		if (email) {
			await EmSender.sendEmailToCusOrderAnswerQuestion(email);
		}
		await EmSender.sendEmailToAdminAnswerQuestion(phone, question);
		return this.response(200, "Answering in processing.", res);
	};
}

export default new WorkWithCustomer();
