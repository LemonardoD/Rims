import { PreparedQuery, PreparedQueryConfig } from "drizzle-orm/pg-core";

export interface RimInfoFromDBDTO {
	rimId: number | bigint;
	brand: string;
	name: string;
	nameSuff: string | null;
	image: string;
	rimConfigs: ConfigsDBDTO;
	price: number;
}

export interface SortedRimInfoDTO {
	rimId: string;
	brand: string;
	name: string;
	image: string;
	config: ConfigsDBDTO[];
	diameters: string[];
	minPrice: number[];
}

export type OmitedRimInfoFromDBDTO = Omit<RimInfoFromDBDTO, "image"> & { images: string[] };

export type OmitedSortedRimInfoDTO = Omit<SortedRimInfoDTO, "image"> & { images: string[] };

export type PrepQuer = PreparedQuery<
	PreparedQueryConfig & {
		execute: RimInfoFromDBDTO[];
	}
>;

export type PrepByIdQuer = PreparedQuery<
	PreparedQueryConfig & {
		execute: OmitedRimInfoFromDBDTO[];
	}
>;

export interface ConfigsDBDTO {
	diameter: string;
	width: string;
	centralBore: number | null;
	boltPattern: string;
	offset: number;
	price: number;
}

export interface SearchByCarDTO {
	brand: string;
	model: string;
	year: string;
}

export interface RimParamDTO {
	width: string;
	diameter: string;
}

export interface CarConfigsDTO {
	pcd: string;
	rims: [RimParamDTO];
	engines: string[];
}

export interface CarYearsDTO {
	value: number;
	configs: [CarConfigsDTO];
}

export interface CarModelsDTO {
	years: CarYearsDTO[];
}
