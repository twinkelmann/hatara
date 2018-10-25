const defaultConfig = {
  moveToPositionOnWatch: true,
  askBeforeWatchingPosition: true
}

/**
 * @type {typeof defaultConfig}
 */
export const config = JSON.parse(JSON.stringify(defaultConfig))

export function storeConfigOnDisk()
{
  localStorage.setItem('config', JSON.stringify(config))
}

export function tryLoadConfigFromDisk()
{
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
