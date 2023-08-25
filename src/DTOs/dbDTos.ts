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

export interface RimInfoByIdDTO {
	rimId: string;
	brand: string | null;
	name: string;
	images: string[];
	config?: ConfigsDBDTO[];
	diameters?: string[];
	minPrice?: number[];
}

export interface SortedRimInfoDTO {
	rimId: string;
	brand: string | null;
	name: string;
	image: string;
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

export interface SrchRimByConfCarDTO {
	pcd: string;
	rims: [{ width: string; diameter: string }];
}

export interface CarYearsDTO {
	value: number;
	configs: [{ pcd: string; rims: [{ width: string; diameter: string }] }];
	engines: string[];
}

export interface CarModelsDTO {
	years: CarYearsDTO[];
}
