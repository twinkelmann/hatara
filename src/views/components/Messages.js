import m from 'mithril'

import { store } from '../../logic';

export default {
  view: () => m('.messages-container',
  // TODO: message content lines
    store.messages.map(message => m('.message-element', message.content)))
}
