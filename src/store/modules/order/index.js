import _ from 'lodash'
import state from './state'
import action from './action'
import info from './info'

export default _.merge(state, action, info)
