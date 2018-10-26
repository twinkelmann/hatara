import m from 'mithril'

import Home from './views/pages/Home'
import { tryReadConfig, config } from './config'

import * as i18n from './i18n'

function main()
{
  // localStorage.removeItem('config')
  tryReadConfig()
  if (config.forceLocale) i18n.setLocale(config.locale).then(() => m.redraw())
  else i18n.init(navigator.languages).then(() => m.redraw())

  const root = document.getElementById('app')

  m.mount(root, Home)
}

main()
