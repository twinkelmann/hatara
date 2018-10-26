import m from 'mithril'

import { store, events } from '../../logic'
import { geolocationMessages } from '../../utils'
import { config } from '../../config'

import { ts } from '../../i18n'

let watchId = -1

function disableWatch()
{
  navigator.geolocation.clearWatch(watchId)
  store.watchPosition = false
  store.lockToPosition = false
  events.emit('message', ts('position-watch-disabled'))
  events.emit('stoppedWatching')
}

function enableWatch()
{
  watchId = navigator.geolocation.watchPosition(position =>
  {
    console.log(position)
    store.lastUserPosition = position
    events.emit('updateUserPosition', position)
  }, e =>
  {
    events.emit('message', ts(geolocationMessages[e.code]))
    disableWatch()
  }, {
    enableHighAccuracy: true,
    timeout: 15000
  })
}

export default {
  view: () => m(`[title=${ts('watch-position-tooltip')}].fab.fab--bottom-right.shadow.no-select${store.hideInterface || store.fullscreen ? '.hidden' : ''}${store.watchPosition ? '.enabled' : ''}`, {
    onclick() {
      if (store.watchPosition) {
        disableWatch()
        return
      }

      store.watchPosition = true
      if (config.moveToPositionOnWatch) store.lockToPosition = true

      if (config.askBeforeWatchingPosition) {
        store.dialog.show = true
        store.dialog.title = ts('position-dialog-title')
        store.dialog.content = ts('position-dialog-content')
        store.dialog.accept = ts('position-dialog-accept')
        store.dialog.dismiss = ts('position-dialog-dismiss')
        m.redraw()
        events.once('dialogAccepted', enableWatch)
        events.once('dialogDismissed', () => store.watchPosition = false)
      } else {
        enableWatch()
      }

    }
  }, m('.material-icons', store.watchPosition ? 'location_on' : 'location_off'))
}
