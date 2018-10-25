import m from 'mithril'

import './Dialog.scss'
import { store, events } from '../../logic'

export default {
  dismiss(e) {
    e.stopPropagation()
    store.dialog.show = false
    events.emit('dialogDismissed')
  },
  accept(e) {
    e.stopPropagation()
    store.dialog.show = false
    events.emit('dialogAccepted')
  },
  view() { return m(`.dialog-wrapper${store.dialog.show ? '' : '.no-display'}`, { onclick: this.dismiss },
    m('.dialog-box.shadow', { onclick: e => e.stopPropagation() },  // don't close if user clicks on dialog
      m('.dialog-row.dialog-row--title', store.dialog.title),
      m('.dialog-row.dialog-row--content', m.trust(store.dialog.content)),
      m('.dialog-row.dialog-row--options',
        m('.dialog-option.dialog-option--dismiss.no-select', { onclick: this.dismiss }, store.dialog.dismiss),
        m('.dialog-option.dialog-option--accept.no-select', { onclick: this.accept }, store.dialog.accept))))
  }
}
