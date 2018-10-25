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
      layers: [ L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') ]
    })

    function moveMap(latLng, accuracy)
    {
      const zoomLevel = accuracyToZoomLevel(accuracy, 8, 19)
      map.setView(latLng, zoomLevel)
    }

    const ICON_SIZE = 32

    const userIcon = L.icon({
        iconUrl: 'user-location.svg',
        iconSize: [ ICON_SIZE, ICON_SIZE ],
        popupAnchor: [ 0, -ICON_SIZE / 2 ]
    })

    // position marker
    const userPosition = L.marker([ 0, 0 ], {
      title: 'Votre position',
      opacity: 0,
      icon: userIcon
    }).addTo(map)

    // move to the marker position on click
    userPosition.on('click', () => moveMap([ store.lastUserPosition.coords.latitude, store.lastUserPosition.coords.longitude ], store.lastUserPosition.coords.accuracy))
    
    // precision circle around the marker
    const userPrecision = L.circle([ 0, 0 ], {
      radius: 0,
      opacity: 0.5,
      weight: 2
    }).addTo(map)

    const widthBreakpoint = 960
    const heightBreakpoint = 500

    function actionStart()
    {
      // disable user view locking
      store.lockToPosition = false

      // hide the interface
      if (window.innerWidth > widthBreakpoint && window.innerHeight > heightBreakpoint) return m.redraw()
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

    events.on('stoppedWatching', () =>
    {
      userPosition.setOpacity(0.7)
      userPosition.bindPopup('Votre dernière position connue')
    })

    events.on('updateUserPosition', position =>
    {
      const latLng = [ position.coords.latitude, position.coords.longitude ]
      userPosition.setLatLng(latLng)
      userPosition.setOpacity(1)
      userPosition.bindPopup(userPosition.options.title)
      userPrecision.setLatLng(latLng)
      userPrecision.setRadius(position.coords.accuracy / 2)
      

      if (store.lockToPosition) {
        // don't trigger the callback when we are programmatically moving to the new user's location
        map.off('movestart', actionStart)
        map.off('zoomstart', actionStart)

        moveMap(latLng, position.coords.accuracy)

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
