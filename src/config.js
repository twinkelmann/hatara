const defaultConfig = {
  moveToPositionOnWatch: true,
  askBeforeWatchingPosition: true,
  locale: 'en',
  forceLocale: false
}

/**
 * @type {typeof defaultConfig}
 */
export const config = JSON.parse(JSON.stringify(defaultConfig))

export function writeConfig()
{
  console.log('Writing config to local storage...')
  localStorage.setItem('config', JSON.stringify(config))
}

export function tryReadConfig()
{
  console.log('Trying to get config from local storage...')
  const onDisk = localStorage.getItem('config')

  try {
    const parsed = JSON.parse(onDisk)

    // check if all keys are valid
    for (const p in parsed) {
      if (defaultConfig.hasOwnProperty(p) && typeof parsed[p] === typeof defaultConfig[p]) continue

      throw 'Invalid config'
    }

    // if everything was fine, assign the config
    // if property are missing, default value will stay
    Object.assign(config, parsed)

  } catch (e) {
    console.warn('Invalid config on disk')
  }
}
