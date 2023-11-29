import { Response } from "express";
import { CarConfigsDTO } from "./dbDTos";

export interface ResCarSearchDTO extends Response {
	locals: CarConfigsDTO;
}

export interface BrandReqDTO {
	params: { brand: string };
}

export type CarBrandAndModelReqDTO = BrandReqDTO & {
	params: { model: string };
};

export type CarBrModYrReqDTO = CarBrandAndModelReqDTO & {
	params: { year: string };
};

export interface RimIdReqDTO {
	params: { id: string };
}

export interface CarNewsReqDTO {
	params: { page: string };
}

export interface SearchByCarReqDTO {
	body: { brand: string; model: string; year: number; rimBrand: string };
}

export interface ConfigDTO {
	mountingHoles: string;
	diameter: string;
	width: string;
}

export interface RimByConfigDTO {
	body: ConfigDTO;
}

export interface OrderConfigDTO {
	width: string;
	offset: number;
	diameter: string;
	boltPattern: string;
	centralBore: number | null;
	price: number;
	rimId: string;
	link: string;
}

export interface OrderReqDTO {
	body: {
		name: string;
		phone: string;
		email: string;
		orderConfig: OrderConfigDTO;
	};
}

export interface OrderCallReqDTO {
	body: { phone: string };
}

export type OrderQuestionReqDTO = OrderCallReqDTO & {
	body: { question: string; email?: string };
};

export interface SearchReqDTO {
	params: { searchText: string };
}

export interface monoCurrencyDTO {
	currencyCodeA: number;
	currencyCodeB: number;
	rateBuy: number;
	rateSell: number;
}
