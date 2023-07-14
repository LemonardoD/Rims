export interface RimsByBrand {
	rimId: string | null;
	name: string | null;
	image: string | null;
	diameter: string | null;
	price: number | null;
}

export interface ModelYear {
	model: string | null;
	years: number[] | undefined;
}

export interface RimById {
	name: string | null;
	width: string[];
	diameter: string[];
	mountingHoles: string | null;
	price: number | null;
	images: string[] | null;
}

export interface RimConfig {
	pcd: string;
	rims: [
		{
			width: string;
			diameter: string;
		},
	];
}

export interface SearchByCarDto {
	brand: string;
	model: string;
	year: number;
}

export interface SrchRimByConfCarDto {
	pcd: string;
	rims: [{ width: string; diameter: string }];
}

export interface SearchRimByConfDto {
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
