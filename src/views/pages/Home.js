import m from 'mithril'

import './Home.scss'

import Header from '../components/Header'
import LeafletMap from '../components/LeafletMap'
import PositionFab from '../components/PositionFab'
import Messages from '../components/Messages'
import Dialog from '../components/Dialog'
import PositionLockFab from '../components/PositionLockFab'

export default {
  view: () => m('.wrapper',
    m(Dialog),
    m(Header),
    m(LeafletMap),
    m(PositionFab),
    m(PositionLockFab),
    m(Messages))
}
