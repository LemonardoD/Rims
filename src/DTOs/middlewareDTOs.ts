import { Response } from "express";
import { SrchRimByConfCarDto } from "./dbDTos";

export interface ResCarSearchDto extends Response {
	locals: SrchRimByConfCarDto;
}

export interface CarBrandReqDto {
	params: { brand: string };
}

export interface SearchByCarReqDto {
	body: { brand: string; model: string; year: number };
}

export interface RimBrandsReqDto {
	body: { rimBrand: string };
}

export interface RimIdReqDto {
	body: { id: string };
}

export interface RimByConfigDto {
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
