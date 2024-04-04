import { FormLabel, HStack, Input, Tag, TagLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { searchOsmPlace } from "../actions/actions";
import { OsmPlace } from "../types/types";
import LocationMap from "./LocationMap";

type SearchPlaceProps = {
  initialPlace?: OsmPlace;
  onSelectPlace: (place: OsmPlace) => void;
};

const SearchPlace: React.FC<SearchPlaceProps> = ({ initialPlace, onSelectPlace }) => {
  const [selectedPlace, setSelectedPlace] = useState<OsmPlace | undefined>(initialPlace);
  const [listPlace, setListPlace] = useState<OsmPlace[] | undefined>();
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [onlineEvent, setOnlineEvent] = useState(false);

  useEffect(() => {
    if (selectedPlace != null) onSelectPlace(selectedPlace);
  }, [selectedPlace]);
  useEffect(() => {
    if (debouncedInputValue != null) {
      fetchOsmPlace(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(async () => {
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue, 500]);

  const search = async (value: string): Promise<void> => {
    setSelectedPlace(undefined);
    setInputValue(value);
  };

  const fetchOsmPlace = async (value: string): Promise<void> => {
    try {
      const response = await searchOsmPlace(value);
      setListPlace(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickPlace = (place: OsmPlace): void => {
    setSelectedPlace(place);
    setListPlace(undefined);
  };

  const onOnlineClick = (): void => {
    setOnlineEvent(true);
    setSelectedPlace(undefined);
    setListPlace(undefined);
    setInputValue("");
  };

  return (
    <div>
      <FormLabel htmlFor="location">Event location:</FormLabel>
      <HStack spacing={4}>
        <Tag colorScheme={onlineEvent ? "gray" : "blue"} borderRadius="full" variant="solid" onClick={() => setOnlineEvent(false)}>
          <TagLabel>Venue</TagLabel>
        </Tag>
        <Tag colorScheme={!onlineEvent ? "gray" : "blue"} borderRadius="full" variant="solid" onClick={onOnlineClick}>
          <TagLabel>Online event</TagLabel>
        </Tag>
      </HStack>

      {!onlineEvent && (
        <>
          {selectedPlace && <LocationMap position={{ lat: Number(selectedPlace.lat), lng: Number(selectedPlace.lon) }} zoom={6} />}
          <Input
            id="location"
            onChange={(e) => search(e.target.value)}
            value={selectedPlace ? "🚩 " + selectedPlace?.display_name : undefined}
          />
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
        </>
      )}
    </div>
  );
};

export default SearchPlace;
