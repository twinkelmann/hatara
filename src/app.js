import m from 'mithril'

import Home from './views/pages/Home'
import { tryLoadConfigFromDisk } from './config'

function main()
{
  tryLoadConfigFromDisk()
  const root = document.getElementById('app')

  m.mount(root, Home)
}

main()
