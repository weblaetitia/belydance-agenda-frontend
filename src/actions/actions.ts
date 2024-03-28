import { OsmPlace } from "../types/types";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export const searchOsmPlace = async (value: string): Promise<OsmPlace[] | undefined> => {
  const params = { q: value, format: "json", addressdetails: "1", polygon_geojson: "0" };
  const options = { method: "GET", redirect: "follow" } as RequestInit;
  try {
    const raw = await fetch(`${NOMINATIM_BASE_URL}` + new URLSearchParams(params).toString(), options);
    const response = await raw.json();
    return response as OsmPlace[];
  } catch (error) {
    console.error(error);
  }
};
