import m from 'mithril'

import { store } from '../../logic'
import { config, writeConfig } from '../../config'

import * as i18n from '../../i18n'

const languages = Object.entries(require('../../../res/lang/languages.json'))

export default {
  view: () => m(`.sidebar${store.showMenu ? '' : '.hidden'}`,
    m('.sidebar-region.sidebar-region--config',
      m('h2', i18n.ts('parameters-region-title')),
      m('.config-line',
        m('label.config-text', i18n.ts('parameter-description-ask-before-watching-position')),
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
            m('span.slider')))),
      m('.config-line',
        m('label.config-text', i18n.ts('parameter-description-move-to-position-on-watch')),
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
            m('span.slider')))),
      m('.config-line',
        m('label.config-text', i18n.ts('parameter-description-language')),
        m(`.material-icons.reset-language.no-select${config.forceLocale ? '' : '.no-display'}`, {
          onclick: async () =>
          {
            config.forceLocale = false
            await i18n.init(navigator.languages)
            config.locale = i18n.locale
            writeConfig()
            m.redraw()
          }  
        }, 'restore'),
        m('select.shadow', {
          async onchange()
          {
            await i18n.setLocale(this.value)
            m.redraw()
            config.locale = i18n.locale
            config.forceLocale = true
            writeConfig()
          }
        },
          languages.map(([ value, name ]) => m(`option`, { value, selected: i18n.locale === value }, name))))),
    m('.sidebar-region.sidebar-region--license',
      m('h2', 'Licenses'),
      m('.license-line', "Données cartographiques par © les contributeurs d'", m('a[href=https://www.openstreetmap.org/copyright/]', 'OpenStreetMap'), '.'),
      m('.license-line', 'Recherche par ', m('a[href=https://operations.osmfoundation.org/policies/nominatim/]', 'Nominatim'), '. Utilisez le projet avec modération.'),
      m('.license-line.license-line--icon', m('.app-icon'), m('span', 'Hatara (', m('a[href=https://app.kanjialive.com/%E5%83%8D]', '働'),') ' + i18n.ts('hatara-meaning'))),
      m('.license-line', 'Application © 2018 - Tim Winkelmann - License MIT. Code source disponible sur ', m('a[href=https://github.com/winktim/hatara]', 'Github'), '. Toute contribution est la bienvenue.')))
}
