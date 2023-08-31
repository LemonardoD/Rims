import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { OrderConfigDTO } from "../DTOs/otherDTOs";
dotenv.config();

const { ADMINS_EMAIL_FOR_ORDERS, EMAIL, EMAIL_PASSWORD } = process.env;
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: EMAIL,
		pass: EMAIL_PASSWORD,
	},
});

enum Subject {
	Customer = "Order from Ukrdisk",
	AdminOrder = "You get new order!!!",
	AdminPhCall = "You get new request for phone call!!!",
}

enum Text {
	Customer = "We get your order, it may takes few hours till we contact with you. And concretizes some details.",
	CustomerQuestion = "We get your question, it may takes few hours till we contact with you. And we will satisfy your interest.",
	AdminOrder = "Here is customer info, please, contact him and talk through details! ",
	AdminPhCall = "Customer requested a phone call, please, contact him.",
	AdminQuestion = "Customer need some help, this is his question, please study the question and contact him. ",
}

class EmailSender {
	sendEmailToCusOrder = async (toWhom: string) => {
		const mailOptions = {
			from: EMAIL,
			to: toWhom,
			subject: Subject.Customer,
			text: Text.Customer,
		};
		return transporter.sendMail(mailOptions, async function (err: Error | null) {
			if (err) throw err;
		});
	};

	sendEmailToAdminOrder = async (customerPhone: string, customerName: string, orderConfig: OrderConfigDTO) => {
		const mailOptions = {
			from: EMAIL,
			to: ADMINS_EMAIL_FOR_ORDERS,
			subject: Subject.AdminOrder,
			text: `${Text.AdminOrder} His phone: ${customerPhone}, his name is: ${customerName}. Ordered ${
				orderConfig.rimId
			} with parameters diameter:${orderConfig.diameter},  
			width:${orderConfig.width}, pcd:${orderConfig.boltPattern}, cb:${orderConfig.centralBore}, offset:${
				orderConfig.offset
			}. Total for 4 rim:${orderConfig.price * 4}`,
		};
		return transporter.sendMail(mailOptions, async function (err: Error | null) {
			if (err) throw err;
		});
	};

	sendEmailToAdminPhCall = async (customerPhone: string) => {
		const mailOptions = {
			from: EMAIL,
			to: ADMINS_EMAIL_FOR_ORDERS,
			subject: Subject.AdminOrder,
			text: `${Text.AdminPhCall} His phone: ${customerPhone}.`,
		};
		return transporter.sendMail(mailOptions, async function (err: Error | null) {
			if (err) throw err;
		});
	};

	sendEmailToAdminAnswerQuestion = async (customerPhone: string, customerQuestion: string) => {
		const mailOptions = {
			from: EMAIL,
			to: ADMINS_EMAIL_FOR_ORDERS,
			subject: Subject.AdminOrder,
			text: `${Text.AdminQuestion + customerQuestion}. His phone: ${customerPhone}.`,
		};
		return transporter.sendMail(mailOptions, async function (err: Error | null) {
			if (err) throw err;
		});
	};

	sendEmailToCusOrderAnswerQuestion = async (toWhom: string) => {
		const mailOptions = {
			from: EMAIL,
			to: toWhom,
			subject: Subject.Customer,
			text: `${Text.CustomerQuestion}`,
		};
		return transporter.sendMail(mailOptions, async function (err: Error | null) {
			if (err) throw err;
		});
	};
}
export default new EmailSender();
