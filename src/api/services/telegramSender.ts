import "dotenv/config";
import { Response } from "express";
import Handler from "../helpers/handler";
import { bot } from "../../configurations/telegramBotConfig";
import { OrderCallReqDTO, OrderQuestionReqDTO, OrderReqDTO } from "../types/otherDto";

const { TG_CORE_GROUP_ID, TG_OFFICE_GROUP_ID } = <{ TG_CORE_GROUP_ID: string; TG_OFFICE_GROUP_ID: string }>process.env;

export const orderMessage = async (req: OrderReqDTO, res: Response) => {
	const { name, phone, email, orderConfig } = req.body;

	try {
		const messToSend = `*Новый заказ дисков*\n ${orderConfig.link}\n Диаметр: *${orderConfig.diameter}*\n PCD: *${orderConfig.boltPattern}*\n -\n 
		*Контакты:*\n Имя: ${name}\n Номер: ${phone}\n Почта: ${email}\n`;
		await bot.sendMessage(TG_CORE_GROUP_ID, messToSend);
		await bot.sendMessage(TG_OFFICE_GROUP_ID, messToSend);

		return Handler.sendResponse(200, { message: "Order is processing." }, res);
	} catch (error) {
		if (error) return Handler.sendResponse(400, error, res);
	}
};

export const orderCall = async (req: OrderCallReqDTO, res: Response) => {
	const { phone } = req.body;

	try {
		const messToSend = `*Вопрос на сайте*\n Вопрос со страницы информации о компании - Обратний звонок\n -\n *Контакты:*\n Номер: ${phone}`;
		await bot.sendMessage(TG_CORE_GROUP_ID, messToSend);
		await bot.sendMessage(TG_OFFICE_GROUP_ID, messToSend);

		return Handler.sendResponse(200, { message: "Order is processing." }, res);
	} catch (error) {
		if (error) return Handler.sendResponse(400, error, res);
	}
	return Handler.sendResponse(200, { message: "Phone call is processing." }, res);
};
export const orderQuestion = async (req: OrderQuestionReqDTO, res: Response) => {
	const { question, phone, email } = req.body;

	try {
		const messToSend = `*Вопрос на сайте*\n Вопрос со страницы информации о компании - ${question}\n -\n *Контакты:*\n Номер: ${phone}\n Почта: ${
			email ? email : "Почта не была указана."
		}\n`;
		await bot.sendMessage(TG_CORE_GROUP_ID, messToSend);
		await bot.sendMessage(TG_OFFICE_GROUP_ID, messToSend);

		return Handler.sendResponse(200, { message: "Answer is processing." }, res);
	} catch (error) {
		if (error) return Handler.sendResponse(400, error, res);
	}
};
