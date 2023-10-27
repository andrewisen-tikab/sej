import proj4 from 'proj4';

export type NamedProjections = {
    /**
     * E.g. `WGS84`
     */
    key: string;
    /**
     * E.g. `+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees`
     */
    projection: string;
};

export type GISHelper = {
    enabled: boolean;
    namedProjections: NamedProjections[];
    proj4: typeof proj4;
    addNamedProjection: (namedProjection: NamedProjections) => void;
};

export type Coordinate = {
    latitude: number;
    longitude: number;
};
