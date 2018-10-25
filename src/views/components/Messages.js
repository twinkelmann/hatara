import m from 'mithril'

import { store } from '../../logic';

export default {
  view: () => m('.messages-container',
    store.messages.map(message => m('.message-element', message.content)))
}
