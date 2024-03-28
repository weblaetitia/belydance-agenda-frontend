export type Event = {
  id?: string;
  version?: number;
  name: string;
  imageUrl: string;
  facebookUrl: string;
  danceTypes: string[];
  eventTypes: string[];
  artists: Artist[];
  location?: OsmPlace;
  startDate?: number;
  endDate?: number;
  formatedDate?: string;
  isFree: boolean;
  vendorUrl?: string;
  websiteUrl?: string;
  organizerEmail?: string;
  eventDescription: string;
  usersId?: string;
};

export type EventExtract = {
  id: string;
  name: string;
  startDate: number;
};

export type Artist = {
  id: string;
  name: string;
  urls: {
    instagramUrl?: string;
    facebookUrl?: string;
    websiteUrl?: string;
    youtubeUrl?: string;
  };
  location: {
    city?: string;
    country?: string;
  };
};

export type FacebookEvent = {
  id: string; // id in url
  name: string;
  description: string;
  location?: {
    id: string;
    name: string;
    description?: string;
    url?: string;
    coordinates: {
      latitude: 48.357270730507;
      longitude: 10.89127084553;
    };
    countryCode: string; // TODO country code
    type: string;
    address?: string;
    city?: string;
  };
  photo: {
    url: string;
    id: number;
    imageUri: string; // This
  };
  video?: string;
  isOnline: false;
  url: string; // facebbok event url
  startTimestamp: 1720420200;
  endTimestamp: 1720965600;
  formattedDate: string;
  timezone: string; // TODO timezone type
  onlineDetails?: null; // TODO mustbe object
  hosts: [
    {
      id: string;
      name: string;
      url: string;
      type: string; // TODO type ("User" | ...)
      photo: null; // TODO
    }
  ];
  ticketUrl?: string;
  usersResponded: 20;
};

export type OsmPlace = {
  place_id: number; // 106629280,
  licence: string;
  osm_type: string; // node
  osm_id: number; // 2469850438,
  lat: string; //44.7521774,
  lon: string; // 5.37479,
  class: string; // shop,
  type: string; // convenience,
  place_rank: number; // 30,
  importance: number; // 0.00000999999999995449,
  addresstype: string; // shop,
  name: string; // La Carline,
  display_name: string; // La Carline, Rue du Viaduc, Place de l'Horloge, Les Fondeaux, Die, Drôme, Auvergne-Rhône-Alpes, France métropolitaine, 26150, France,
  address: {
    shop: string; // La Carline,
    road: string; // Rue du Viaduc,
    neighbourhood: string; // Place de l'Horloge,
    hamlet: string; // Les Fondeaux,
    village: string; // Die,
    municipality: string; // Die,
    county: string; // Drôme,
    "ISO3166-2-lvl6": string; // FR-26,
    state: string; // Auvergne-Rhône-Alpes,
    "ISO3166-2-lvl4": string; // FR-ARA,
    region: string; // France métropolitaine,
    postcode: string; // 26150,
    country: string; // France,
    country_code: string; // fr
  };
  boundingbox: string[];
};
