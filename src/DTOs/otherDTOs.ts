import { Response } from "express";
import { SrchRimByConfCarDTO } from "./dbDTos";

export interface ResCarSearchDTO extends Response {
	locals: SrchRimByConfCarDTO;
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
	params: { offset: string };
}

export interface SearchByCarReqDTO {
	body: { brand: string; model: string; year: number };
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
	mountingHoles: string;
	diameter: string;
	width: string;
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

export interface FeedArrayDTO {
	pubDate: Date;
	link: string;
	title: string;
	sourceName: string | undefined;
}

export interface FeedsDTO {
	items: { [key: string]: string }[];
	title?: string;
}

export interface monoCurrencyDTO {
	currencyCodeA: number;
	currencyCodeB: number;
	rateBuy: number;
	rateSell: number;
}
