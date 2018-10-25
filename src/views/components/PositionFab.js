import m from 'mithril'

import './Fab.scss'

import { store, events } from '../../logic'
import { geolocationMessages } from '../../utils'

let watchId = -1

export default {
  view: () => m(`.fab.fab--bottom-right.shadow.no-select${store.hideInterface || store.fullscreen ? '.hidden' : ''}${store.watchPosition ? '.enabled' : ''}`, {
    onclick() {
      if (store.watchPosition) {
        navigator.geolocation.clearWatch(watchId)
        store.watchPosition = false
        events.emit('message', 'Nous ne suivons plus votre position')
        return
      }
      store.dialog.show = true
      store.dialog.title = 'Suivre la position'
      store.dialog.content = 'Nous autorisez-vous à suivre votre position ?<br>Vous pouvez désactiver cette alerte dans les paramètres.'
      store.dialog.accept = 'Oui'
      store.dialog.dismiss = 'Annuler'
      m.redraw()

      events.once('dialogAccepted', () =>
      {
        store.watchPosition = true
        store.lockToPosition = true
        m.redraw()
        watchId = navigator.geolocation.watchPosition(position =>
        {
          console.log(position)
          store.lastUserPosition = position
          events.emit('updateUserPosition', position)
        }, e =>
        {
          events.emit('message', geolocationMessages[e.code])
        })
      })
    }
  }, m('.material-icons', store.watchPosition ? 'location_on' : 'location_off'))
}
