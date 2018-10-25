
const languages = navigator.languages.map(encodeURIComponent).join(',')

/**
 * Query the Nominatim Database for a given user query
 * @param {string} query 
 * @returns {Promise<{boundingbox: [number, number, number, number], display_name: string}[]>}
 */
export async function queryNominatim(query)
{
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&accept-language=${languages}`
  return fetch(url).then(res => res.json())
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function accuracyToZoomLevel(accuracy, minZoom, maxZoom)
{
  return clamp(Math.floor((accuracy - 5) / 5000 * (minZoom - maxZoom) + maxZoom), minZoom, maxZoom)
}

export const geolocationMessages = {
  1: "Votre navigateur nous a refusé l'accès à votre position",
  2: "La position n'est pas disponible sur votre périphérique actuel",
  3: 'La position a mis trop de temps à être récupérée',
}
