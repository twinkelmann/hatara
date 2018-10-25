import m from 'mithril'

import { events, store } from '../../logic'
import { accuracyToZoomLevel } from '../../utils'

export default {
  oncreate: ({ dom }) =>
  {
    const map = L.map(dom, {
      center: [ 0, 0 ],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
      ]
    })

    const header = document.getElementsByTagName('header')[0]

    const widthBreakpoint = 960
    const heightBreakpoint = 500

    function actionStart()
    {
      // disable user view locking
      store.lockToPosition = false

      // hide the interface
      if (window.innerWidth > widthBreakpoint && window.innerHeight > heightBreakpoint) return
      store.hideInterface = true
      m.redraw()
    }

    function actionEnd()
    {

      // show the interface
      if (window.innerWidth > widthBreakpoint && window.innerHeight > heightBreakpoint) return
      store.hideInterface = false
      m.redraw()
    }

    map.on('movestart', actionStart)
    map.on('zoomstart', actionStart)
    map.on('moveend', actionEnd)
    map.on('zoomend', actionEnd)

    events.on('fitBounds', bounds =>
    {
      map.fitBounds(bounds)
    })

    events.on('updateUserPosition', position =>
    {
      // TODO: update marker
      

      if (store.lockToPosition) {
        // don't trigger the callback when we are programmatically moving to the new user's location
        map.off('movestart', actionStart)
        map.off('zoomstart', actionStart)

        const zoomLevel = accuracyToZoomLevel(position.coords.accuracy, 8, 19)
        map.setView([ position.coords.latitude, position.coords.longitude ], zoomLevel)

        // trigger the callback again next time
        map.on('movestart', actionStart)
        map.on('zoomstart', actionStart)
      }
    })
  },
  view: () => m('#map-container.fit-parent')
}
