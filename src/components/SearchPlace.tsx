import { Button, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { OsmPlace } from "../types/types";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const SearchPlace = () => {
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState<OsmPlace[] | undefined>();

  const onSearch = async () => {
    const params = { q: searchText, format: "json", addressdetails: "1", polygon_geojson: "0" };
    const options = { method: "GET", redirect: "follow" } as RequestInit;
    try {
      const raw = await fetch(`${NOMINATIM_BASE_URL}` + new URLSearchParams(params).toString(), options);
      const response = await raw.json();
      console.log(response);
      setListPlace(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <FormLabel htmlFor="location">Event location:</FormLabel>
      <Input id="location" onChange={(e) => setSearchText(e.target.value)} />
      <Button onClick={onSearch}>Search</Button>
      {listPlace && (
        <ul>
          {listPlace.map((place) => {
            return <li key={place.osm_id}>{place.display_name}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchPlace;
