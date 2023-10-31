import "dotenv/config";
import { EmailOptionsDTO, OrderConfigDTO } from "../DTOs/otherDTOs";
import { transporter } from "../../configurations/emailSenderConfig";
import Handler from "../helpers/handler";
import nodemailer, { SentMessageInfo } from "nodemailer";

const { ADMINS_EMAIL_FOR_ORDERS, EMAIL } = <{ ADMINS_EMAIL_FOR_ORDERS: string; EMAIL: string }>process.env;

export enum Subject {
	Customer = "Order from Ukrdisk",
	AdminOrder = "You get new order!!!",
	AdminPhCall = "You get new request for phone call!!!",
}

enum Text {
	Customer = "We get your order, it may takes few hours till we contact with you. And concretizes some details.",
	CustomerQuestion = "We get your question, it may takes few hours till we contact with you. And we will satisfy your interest.",
	AdminOrder = "Here is customer info, please, contact him and talk through details! ",
	AdminPhCall = "Customer requested a phone call, please, contact him.",
	AdminQuestion = "Customer need some help, this is his question, please study the question and contact him.",
}

class EmailSender {
	sender: nodemailer.Transporter<SentMessageInfo>;
	constructor(transporter: nodemailer.Transporter<SentMessageInfo>) {
		this.sender = transporter;
	}
	sendEmail = async (sender: nodemailer.Transporter<SentMessageInfo>, mailOptions: EmailOptionsDTO) => {
		return sender.sendMail(mailOptions).catch(err => {
			Handler.error("Something gone wrong. Can not send Email.", 500);
		});
	};
	sendEmailToCusOrder = async (toWhom: string) => {
		const mailOptions = {
			from: EMAIL,
			to: toWhom,
			subject: Subject.Customer,
			text: Text.Customer,
		};
		return this.sendEmail(this.sender, mailOptions);
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
		return this.sendEmail(this.sender, mailOptions);
	};

	sendEmailToAdminPhCall = async (customerPhone: string) => {
		const mailOptions = {
			from: EMAIL,
			to: ADMINS_EMAIL_FOR_ORDERS,
			subject: Subject.AdminOrder,
			text: `${Text.AdminPhCall} His phone: ${customerPhone}.`,
		};
		return this.sendEmail(this.sender, mailOptions);
	};

	sendEmailToAdminAnswerQuestion = async (customerPhone: string, customerQuestion: string) => {
		const mailOptions = {
			from: EMAIL,
			to: ADMINS_EMAIL_FOR_ORDERS,
			subject: Subject.AdminOrder,
			text: `${Text.AdminQuestion + customerQuestion}. His phone: ${customerPhone}.`,
		};
		return this.sendEmail(this.sender, mailOptions);
	};

	sendEmailToCusOrderAnswerQuestion = async (toWhom: string) => {
		const mailOptions = {
			from: EMAIL,
			to: toWhom,
			subject: Subject.Customer,
			text: `${Text.CustomerQuestion}`,
		};
		return this.sendEmail(this.sender, mailOptions);
	};
}
export default new EmailSender(transporter);
