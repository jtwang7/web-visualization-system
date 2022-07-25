export interface POI {
  id?: number;
  typeId?: string;
  type?: string;
  name?: string;
  location?: [number, number];
  address?: string;
}

export type POIForPie = Pick<POI, "type" | "typeId"> & { value: number };
