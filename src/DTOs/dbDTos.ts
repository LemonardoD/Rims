export interface RimsMainSortedBrandDTO {
	rimId: string | null;
	name: string | null;
	image: string | null;
	diameter: string | null;
	price: number | null;
}

export interface RimsFromDBDTO {
	rimId: number | bigint | null;
	rimBrand: string | null;
	rimName: string | null;
	image: string | null;
	diameter: string | null;
	price: number | null;
}

export interface RimByIdDTO {
	name: string | null;
	width: string[];
	diameter: string[];
	mountingHoles: string | null;
	price: number | null;
	images: string[] | null;
}

export interface RimByIdFromDBDTO {
	rimDiameter: string | null;
	rimWidth: string | null;
	mountingHoles: string | null;
	priceUSD: number | null;
	rimBrand: string | null;
	rimName: string | null;
	images: string[] | null;
}

export interface RimConfigInfoDTO {
	pcd: string;
	rims: [
		{
			width: string;
			diameter: string;
		},
	];
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

export interface SearchRimByConfDTO {
	width: string;
	diameter: string;
	mountHoles: string;
}

export interface MainPgReturnRimDTO {
	rimId: string | null;
	name: string | null;
	image: string | null;
	diameter: string | null;
	price: number | null;
}

export interface RimConfigDTO {
	diameter: string[];
	width: string[];
	mountHoles: string[];
}

export interface OffersDTO {
	et: number;
	count: number;
	width: string;
	vendor: string;
	diameter: string;
	centerBore: number;
	priceInUsd: number;
	boltPattern: string;
}

export interface CarModelsDTO {
	years: null | { value: number; configs: [{ pcd: string; rims: [{ width: string; diameter: string }] }]; engines: string[] }[];
}

export interface ItemsAttributesDTO {
	type: string;
	color: null | string;
	name_suffix: null | string;
}
