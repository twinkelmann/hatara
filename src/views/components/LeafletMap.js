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

    // position marker
    const userPosition = L.marker([ 0, 0 ], {
      title: 'Votre position actuelle',
      opacity: 0
    }).addTo(map)
    
    // precision circle around the marker
    const userPrecision = L.circle([ 0, 0 ], {
      radius: 1,
    }).addTo(map)

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
      // position lock is automatically disabled because we trigger the map movement callbacks
      map.fitBounds(bounds)
    })

    events.on('updateUserPosition', position =>
    {
      const latLng = [ position.coords.latitude, position.coords.longitude ]
      userPosition.setLatLng(latLng)
      userPosition.setOpacity(1)
      userPrecision.setLatLng(latLng)
      userPrecision.setRadius(position.coords.accuracy / 2)
      

      if (store.lockToPosition) {
        // don't trigger the callback when we are programmatically moving to the new user's location
        map.off('movestart', actionStart)
        map.off('zoomstart', actionStart)

        const zoomLevel = accuracyToZoomLevel(position.coords.accuracy, 8, 19)
        map.setView(latLng, zoomLevel)

        // wait before adding back the callbacks, because for some reason the zoom action doesn't happen immediatly
        setTimeout(() =>
        {
          // trigger the callback again next time
          map.on('movestart', actionStart)
          map.on('zoomstart', actionStart)
        }, 100)

      }
    })
  },
  view: () => m('#map-container.fit-parent')
}
