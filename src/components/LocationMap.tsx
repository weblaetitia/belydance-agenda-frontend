import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export const googleMapApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

type LocationMapPropos = {
  position: {
    lat: number;
    lng: number;
  };
  zoom: number;
};
const LocationMap: React.FC<LocationMapPropos> = ({ position, zoom }) => {
  return (
    <APIProvider apiKey={googleMapApiKey}>
      <Map defaultCenter={position} defaultZoom={zoom} style={{ height: 200 }}>
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
};

export default LocationMap;
