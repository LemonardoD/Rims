import { Response } from "express";
import { SrchRimByConfCarDTO } from "./dbDTos";

export interface ResCarSearchDTO extends Response {
	locals: SrchRimByConfCarDTO;
}

export interface CarBrandReqDTO {
	params: { brand: string };
}

export interface CarBrandAndModelReqDTO {
	params: { brand: string; model: string };
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
	body: { diameter: string; width: string; mountHoles: string };
}

export interface OrderReqDTO {
	body: { name: string; phone: string; email: string };
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
	date: Date;
	link: string;
	artTitle: string;
}

export interface FetchRssFeedDTO {
	items: { [key: string]: string }[];
}
