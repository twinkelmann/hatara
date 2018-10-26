const defaultLocale = 'en'
export let locale = defaultLocale

// load default local with the site
let localeFile = require(`../res/lang/${locale}.json`)

/**
 * 
 * @param {string[]} languages an array of language strings (usually navigator.languages)
 */
export async function init(languages)
{
  // remove duplicates by making a set
  // we only care about the first part of the language string
  const set = new Set(languages.map(lang => lang.split('-')[0]))

  for (const l of set) {
    try {
      const res = await fetch(`lang/${l}.json`)
      localeFile = await res.json()
      locale = l
      console.log('Language set to', l)
      break
    } catch (e) {
      console.warn('Locale', l, 'is not yet supported')
      continue
    }
  }
}

/**
 * Translate some text string
 * 
 * @param {string} text the string to translate
 * @returns {string} the translated string
 */
export function ts(text)
{
  if (localeFile === null) return text
  return localeFile[text] || text
}

export async function setLocale(newLocale)
{
  if (newLocale === locale) return
  return init([ newLocale ])
}
