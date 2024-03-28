import { FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { OsmPlace } from "../types/types";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

type SearchPlaceProps = {
  initialPlace?: OsmPlace;
  onSelectPlace: (place: OsmPlace) => void;
};

const SearchPlace: React.FC<SearchPlaceProps> = ({ initialPlace, onSelectPlace }) => {
  const [selectedPlace, setSelectedPlace] = useState<OsmPlace | undefined>(initialPlace);
  const [listPlace, setListPlace] = useState<OsmPlace[] | undefined>();

  useEffect(() => {
    if (selectedPlace != null) onSelectPlace(selectedPlace);
  }, [selectedPlace]);

  const search = async (value: string): Promise<void> => {
    setSelectedPlace(undefined);
    const params = { q: value, format: "json", addressdetails: "1", polygon_geojson: "0" };
    const options = { method: "GET", redirect: "follow" } as RequestInit;
    try {
      const raw = await fetch(`${NOMINATIM_BASE_URL}` + new URLSearchParams(params).toString(), options);
      const response = await raw.json();
      setListPlace(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickPlace = (place: OsmPlace): void => {
    setSelectedPlace(place);
    setListPlace(undefined);
  };

  return (
    <div>
      <FormLabel htmlFor="location">Event location:</FormLabel>
      <Input
        id="location"
        onChange={(e) => search(e.target.value)}
        value={selectedPlace ? "🚩 " + selectedPlace?.display_name : undefined}
      />
      {/* <Button onClick={onSearch}>Search</Button> */}
      {listPlace && (
        <ul>
          {listPlace.map((place) => {
            return (
              <li key={place.osm_id} onClick={() => onClickPlace(place)}>
                {place.display_name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchPlace;
