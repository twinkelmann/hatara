import m from 'mithril'

import './Fab.scss'

import { store, events } from '../../logic'
import { geolocationMessages } from '../../utils'
import { config } from '../../config'

let watchId = -1

function enableWatch()
{
  watchId = navigator.geolocation.watchPosition(position =>
  {
    console.log(position)
    store.lastUserPosition = position
    events.emit('updateUserPosition', position)
  }, e =>
  {
    store.watchPosition = false
    events.emit('message', geolocationMessages[e.code])
  })
}

export default {
  view: () => m(`[title=Suivre votre position sur la carte].fab.fab--bottom-right.shadow.no-select${store.hideInterface || store.fullscreen ? '.hidden' : ''}${store.watchPosition ? '.enabled' : ''}`, {
    onclick() {
      if (store.watchPosition) {
        // TODO: implement own watch
        navigator.geolocation.clearWatch(watchId)
        store.watchPosition = false
        events.emit('message', 'Nous ne suivons plus votre position')
        return
      }

      store.watchPosition = true
      if (config.moveToPositionOnWatch) store.lockToPosition = true

      if (config.askBeforeWatchingPosition) {
        store.dialog.show = true
        store.dialog.title = 'Suivre la position'
        store.dialog.content = 'Nous autorisez-vous à suivre votre position ?<br>Vous pouvez désactiver cette alerte dans les paramètres.'
        store.dialog.accept = 'Oui'
        store.dialog.dismiss = 'Annuler'
        m.redraw()
        events.once('dialogAccepted', enableWatch)
        events.once('dialogDismissed', () => store.watchPosition = false)
      } else {
        enableWatch()
      }

    }
  }, m('.material-icons', store.watchPosition ? 'location_on' : 'location_off'))
}
