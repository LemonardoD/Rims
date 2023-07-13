import { RequestHandler, Response } from "express";

export class Controller {
	response(statusCode: number, message: string | object | null, res: Response) {
		return res.status(statusCode).json({
			message,
		});
	}
	tryCatch(callback: Function): RequestHandler {
		return async (req, res, next) => {
			try {
				await callback(req, res, next);
			} catch (error) {
				next(error);
			}
		};
	}
}
