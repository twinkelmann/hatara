import m from 'mithril'

import { events, store } from '../../logic'

import './Header.scss'

export default {
  view: vnode => m(`header.shadow${store.inputHasFocus ? '.active' : ''}${store.hideInterface || store.fullscreen ? '.hidden' : ''}`,
    m('.menu.material-icons.no-select', {
      onclick: () => store.showMenu = !store.showMenu
    }, store.showMenu ? 'arrow_back' : 'menu'),
    m(`input[type=text][autofocus][placeholder=${'Parcourir le monde'}]`, {
      value: store.query,
      onkeypress(e) {
        store.query = this.value

        if(e.key !== 'Enter') return
        if (this.value === null || this.value === undefined || this.value === '') return
        
        events.emit('getQuery')
      },
      onfocus() {
        store.inputHasFocus = true
        m.redraw()
      },
      onblur() {
        store.inputHasFocus = false
        m.redraw()
      }
    }),
    m(`.clear.material-icons.no-select${store.query.length === 0 ? '.opacity-0' : ''}`, {
      onclick() {
        store.query = ''
        // focus the input field again
        setImmediate(() => vnode.dom.children[1].focus())
      }
    }, 'backspace'))
}
