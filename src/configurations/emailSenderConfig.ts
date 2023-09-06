import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const { EMAIL, EMAIL_PASSWORD } = process.env;
export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: EMAIL,
		pass: EMAIL_PASSWORD,
	},
});
