import m from 'mithril'

import { events, store } from '../../logic'

import { ts } from '../../i18n'
import { nominatimToLeafletBounds } from '../../utils'

export default {
  view: vnode => m('.header-wrapper',
  m(`.extra-results.shadow${store.inputHasFocus && store.nominatimResponses.length > 1 ? '' : '.hidden'}`,
    store.nominatimResponses.map(res => m('.extra-results--result.no-select', {
      onclick: () =>
      {
        store.query = res.display_name
        events.emit('fitBounds', nominatimToLeafletBounds(res))
      }
    }, res.display_name))),  
  m(`header.shadow${store.inputHasFocus ? '.active' : ''}${store.hideInterface || store.fullscreen ? '.hidden' : ''}`,
      m('.menu.material-icons.no-select', {
        onclick: () => store.showMenu = !store.showMenu
      }, store.showMenu ? 'arrow_back' : 'menu'),
      m(`input[type=text][autofocus][disabled=${store.dialog.show ? 'disabled' : ''}][placeholder=${ts('query-placeholder')}]`, {
        value: store.query,
        onkeyup(e) {
          store.query = String(this.value)

          if(e.key !== 'Enter') return
          if (this.value === null || this.value === undefined || this.value === '') return
          
          events.emit('getQuery')
        },
        onfocus() {
          store.inputHasFocus = true
          m.redraw()
        },
        onblur() {
          // wait before bluring to give the ability to click on the extra results
          setTimeout(() =>
          {
            store.inputHasFocus = false
            m.redraw()
          }, 100)
        }
      }),
      m(`.clear.material-icons.no-select${store.query.length === 0 ? '.opacity-0' : ''}`, {
        onclick() {
          store.query = ''
          store.nominatimResponses = []
          // focus the input field again
          setImmediate(() => vnode.dom.children[1].children[1].focus())
        }
      }, 'backspace')))
}
