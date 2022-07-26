export interface POI {
  id?: number;
  typeId?: string;
  type?: string;
  name?: string;
  location?: [number, number];
  address?: string;
  cellCenter?: [number, number];
}

export type POIForPie = Pick<POI, "type" | "typeId" | "cellCenter"> & {
  value: number;
};
