import m from 'mithril'

import { store, events } from '../../logic'

import { ts } from '../../i18n'

export default {
  view: () => m(`[title=${ts('lock-position-tooltip')}].fab.fab--middle-right.shadow.no-select${store.hideInterface || store.fullscreen || !store.watchPosition ? '.hidden' : ''}${store.lockToPosition ? '.enabled' : ''}`, {
    onclick() {
      store.lockToPosition = !store.lockToPosition

      // restore user position
      if (store.lockToPosition) setImmediate(() => events.emit('updateUserPosition', store.lastUserPosition))
    }
  }, m('.material-icons', store.lockToPosition ? 'my_location' : 'location_disabled'))

}
