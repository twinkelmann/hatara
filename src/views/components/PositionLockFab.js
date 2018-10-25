import m from 'mithril'

import './Fab.scss'

import { store, events } from '../../logic'

export default {
  view: () => m(`.fab.fab--middle-right.shadow.no-select${store.hideInterface || store.fullscreen || !store.watchPosition ? '.hidden' : ''}${store.lockToPosition ? '.enabled' : ''}`, {
    onclick() {
      store.lockToPosition = !store.lockToPosition

      // restore user position
      if (store.lockToPosition) setImmediate(() => events.emit('updateUserPosition', store.lastUserPosition))
    }
  }, m('.material-icons', store.lockToPosition ? 'my_location' : 'location_disabled'))

}
