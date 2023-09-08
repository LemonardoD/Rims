export interface RimInfoFromDBDTO {
	rimId: number | bigint | null;
	brand: string | null;
	name: string | null;
	nameSuff: string | null;
	image?: string | null;
	images?: string[] | null;
	rimConfigs: ConfigsDBDTO | null;
	price: number | null;
}

export interface SortedRimInfoDTO {
	rimId: string;
	brand: string;
	name: string;
	image?: string;
	images?: string[];
	config: ConfigsDBDTO[];
	diameters: string[];
	minPrice: number[];
}

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
	year: number;
}

export interface CarYearsDTO {
	value: number;
	configs: [{ pcd: string; rims: [{ width: string; diameter: string }] }];
	engines: string[];
}
export interface CarConfigsDTO {
	pcd: string;
	rims: [{ width: string; diameter: string }];
}

export interface CarModelsDTO {
	years: CarYearsDTO[];
}
