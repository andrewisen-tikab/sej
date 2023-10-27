/**
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 * @param lon
 * @param zoom
 * @returns
 */
export const lon2tile = (lon: number, zoom: number) => Math.floor(((lon + 180) / 360) * 2 ** zoom);

/**
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 * @param lat
 * @param zoom
 * @returns
 */
export const lat2tile = (lat: number, zoom: number) =>
    Math.floor(
        ((1 -
            Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
                Math.PI) /
            2) *
            2 ** zoom,
    );

/**
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 * @param x
 * @param z
 * @returns
 */
export const tile2long = (x: number, z: number) => (x / 2 ** z) * 360 - 180;

/**
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 * @param y
 * @param z
 * @returns
 */
export const tile2lat = (y: number, z: number) => {
    const n = Math.PI - (2 * Math.PI * y) / 2 ** z;
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};
