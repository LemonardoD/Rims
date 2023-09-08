import { Response } from "express";
import { CarConfigsDTO } from "./dbDTos";

export interface ResCarSearchDTO extends Response {
	locals: CarConfigsDTO;
}

export interface CarBrandReqDTO {
	params: { brand: string };
}

export interface CarBrandAndModelReqDTO extends CarBrandReqDTO {
	params: { brand: string; model: string };
}

export interface CarBrModYrReqDTO extends CarBrandAndModelReqDTO {
	params: { brand: string; model: string; year: string };
}

export interface CarNewsReqDTO {
	params: { page: string };
}

export interface SearchByCarReqDTO {
	body: { brand: string; model: string; year: number; rimBrand: string };
}

export interface RimBrandsReqDTO {
	body: { rimBrand: string };
}

export interface RimIdReqDTO {
	body: { id: string };
}

export interface RimByConfigDTO {
	body: { mountingHoles: string; diameter: string; width: string };
}

export interface ConfigDTO {
	mountingHoles: string;
	diameter: string;
	width: string;
}

export interface OrderConfigDTO {
	width: string;
	offset: number;
	diameter: string;
	boltPattern: string;
	centralBore: number | null;
	price: number;
	rimId: string;
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

export interface OrderQuestionReqDTO {
	body: { question: string; phone: string; email?: string };
}

export interface SearchReqDTO {
	body: { searchText: string };
}

export interface monoCurrencyDTO {
	currencyCodeA: number;
	currencyCodeB: number;
	rateBuy: number;
	rateSell: number;
}
