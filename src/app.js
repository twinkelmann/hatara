import m from 'mithril'

import Home from './views/pages/Home'

function main()
{
  const root = document.getElementById('app')

  m.mount(root, Home)
}

main()
