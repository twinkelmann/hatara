import m from 'mithril'

import './Sidebar.scss'

import { store } from '../../logic'

export default {
  view: () => m(`.sidebar${store.showMenu ? '' : '.hidden'}`,
    m('.sidebar-region.sidebar-region--config'),
      m('h2', 'Paramètres'),
      m('label.switch',
        m('input[type=checkbox]'),
        m('span.slider.round')))
}
