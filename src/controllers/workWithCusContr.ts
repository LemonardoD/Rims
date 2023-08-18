import { Response } from "express";
import EmSender from "../services/emailSender";
import { CusInfoMid } from "../middlewares/workWithCusMidd";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../DTOs/otherDTOs";

class WorkWithCustomer extends CusInfoMid {
	orderRims = async (req: OrderReqDTO, res: Response) => {
		const { name, phone, email, orderConfig } = req.body;
		await EmSender.sendEmailToCusOrder(email);
		await EmSender.sendEmailToAdminOrder(phone, name, orderConfig);
		return this.response(200, { message: "Order is processing." }, res);
	};

	orderAPhoneCall = async (req: OrderCallReqDTO, res: Response) => {
		const { phone } = req.body;
		await EmSender.sendEmailToAdminPhCall(phone);
		return this.response(200, { message: "Phone call is processing." }, res);
	};

	orderAQuestion = async (req: OrderQuestionReqDTO, res: Response) => {
		const { question, phone, email } = req.body;
		if (email) {
			await EmSender.sendEmailToCusOrderAnswerQuestion(email);
		}
		await EmSender.sendEmailToAdminAnswerQuestion(phone, question);
		return this.response(200, { message: "Answer is processing." }, res);
	};
}

export default new WorkWithCustomer();
