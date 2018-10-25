import m from 'mithril'

import hotkeys from 'hotkeys-js'
import { EventEmitter } from 'events'
import { queryNominatim } from './utils'

const MESSAGE_DISPLAY_TIME = 5000

export const events = new EventEmitter

export const store = {
  query: '',
  hideInterface: false,
  fullscreen: false,
  /**
   * @type {{content: string}[]}
   */
  messages: [],
  inputHasFocus: false,
  /**
   * @type {Position}
   */
  lastUserPosition: null,
  dialog: {
    show: false,
    title: 'Test dialog',
    content: 'This is a test dialog. Let\'s make it a lot bigger to see the result on the Web page. Looking pretty good I\'d say ! Yes !',
    dismiss: 'Dismiss',
    accept: 'Accept'
  },
  watchPosition: false,
  lockToPosition: true
}

events.on('getQuery', async () =>
{
  const res = await queryNominatim(store.query)
  // TODO: show all results in dropdown

  if (res.length === 0) {
    events.emit('message', `Aucun résultat pour "${store.query}"`)
    return
  }

  const bounds = res[0].boundingbox.map(parseFloat)

  events.emit('fitBounds', [
    [ bounds[0], bounds[2] ],
    [ bounds[1], bounds[3] ]
  ])

  const nameParts = res[0].display_name.split(', ').filter((part, i, array) => i === 0 || i === array.length - 2 || i === array.length - 1)

  store.query = nameParts.join(', ')
  m.redraw()
})

events.on('message', message =>
{
  const msg = { content: message }
  store.messages.push(msg)
  m.redraw()

  // remove the message after a given time
  setTimeout(() => {
    const index = store.messages.indexOf(msg)
    if (index === -1) return
    store.messages.splice(index, 1)
    m.redraw()
  }, MESSAGE_DISPLAY_TIME)
})

hotkeys('alt+f11', () =>
{
  store.fullscreen = !store.fullscreen
  m.redraw()
})
