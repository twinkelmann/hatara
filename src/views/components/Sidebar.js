import m from 'mithril'

import './Sidebar.scss'

import { store } from '../../logic'
import { config, writeConfig } from '../../config'

export default {
  view: () => m(`.sidebar${store.showMenu ? '' : '.hidden'}`,
    m('.sidebar-region.sidebar-region--config',
      m('h2', 'Paramètres'),
      m('.config-line',
        m('label.config-text', "Toujours demander confirmation avant d'accéder à la position"),
        m('div',
          m('label.switch',
            m('input[type=checkbox]', {
              checked: config.askBeforeWatchingPosition,
              oninput()
              {
                config.askBeforeWatchingPosition = Boolean(this.checked)
                writeConfig()
                
              }
            }),
            m('span.slider.round')))),
      m('.config-line',
        m('label.config-text', "Center sur la position lors de l'activation du suivi"),
        m('div',
          m('label.switch',
            m('input[type=checkbox]', {
              checked: config.moveToPositionOnWatch,
              oninput()
              {
                config.moveToPositionOnWatch = Boolean(this.checked)
                writeConfig()
              }
            }),
            m('span.slider.round'))))),
    m('.sidebar-region.sidebar-region--license',
      m('h2', 'Licenses'),
      m('.license-line', "Données cartographiques par © les contributeurs d'", m('a[href=https://www.openstreetmap.org/copyright/]', 'OpenStreetMap')),
      m('.license-line', 'Recherche par ', m('a[href=https://operations.osmfoundation.org/policies/nominatim/]', 'Nominatim'), '. Utilisez le projet avec modération'),
      m('.license-line', 'Application © 2018 - Tim Winkelmann - License MIT. Code source disponible sur ', m('a[href=https://github.com/winktim/hatara]', 'Github'), '. Toute contribution est la bienvenue')))
}
