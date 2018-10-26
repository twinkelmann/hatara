/**
 * Query the Nominatim Database for a given user query
 * 
 * @param {string} query 
 * @returns {Promise<{boundingbox: [number, number, number, number], display_name: string}[]>}
 */
export async function queryNominatim(query, lang)
{
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&accept-language=${encodeURIComponent(lang)}`
  return fetch(url).then(res => res.json())
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function accuracyToZoomLevel(accuracy, minZoom, maxZoom)
{
  return clamp(Math.floor((accuracy - 5) / 5000 * (minZoom - maxZoom) + maxZoom), minZoom, maxZoom)
}

export const geolocationMessages = {
  1: 'geolocation-error-denied',
  2: 'geolocation-error-unavailable',
  3: 'geolocation-error-timeout',
}

/**
 * Get the bounding box of a nominatim response in the leaflet format
 * 
 * @param {{boundingbox: string[]}} nominatim the nominatim response
 * @returns {[[number, number], [number, number]]}
 */
export function nominatimToLeafletBounds(nominatim)
{
  const bounds = nominatim.boundingbox.map(parseFloat)

  return [
    [ bounds[0], bounds[2] ],
    [ bounds[1], bounds[3] ]
  ]
}
