import { NextFunction, RequestHandler, Response, Request } from "express";
import "dotenv/config";

const { CACHE_MAX_AGE } = <{ CACHE_MAX_AGE: string }>process.env;
const cacheAge = Number(CACHE_MAX_AGE);

export class CustomError extends Error {
	statusCode: number;
	constructor(message: string, code: number) {
		super(message);
		this.statusCode = code;
	}
}

class Handler {
	response(statusCode: number, message: object, res: Response) {
		return res.status(statusCode).json({
			message,
		});
	}

	setCache(req: Request, res: Response, next: NextFunction) {
		if (req.method === "GET") {
			res.set("Cache-control", `public, max-age=${cacheAge}`);
			next();
		}
		if (req.method != "GET") {
			res.set("Cache-control", "no-store");
			next();
		}
	}

	invalidPath(req: Request, res: Response, next: NextFunction) {
		return res.status(404).send("You try an invalid path.");
	}

	error(message: string, code: number) {
		throw new CustomError(message, code);
	}

	tryCatch(callback: Function): RequestHandler {
		return async (req, res, next) => {
			try {
				await callback(req, res, next);
			} catch (error) {
				if (error instanceof CustomError) {
					return res.status(error.statusCode).send(error.message);
				}
				return res.status(500);
			}
		};
	}
}
export default new Handler();
