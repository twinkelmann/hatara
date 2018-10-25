import m from 'mithril'

import Home from './views/pages/Home'
import { tryReadConfig } from './config'

function main()
{
  tryReadConfig()
  const root = document.getElementById('app')

  m.mount(root, Home)
}

main()
