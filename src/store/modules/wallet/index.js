import _ from 'lodash'
import state from './state'
import action from './action'

export default _.merge(state, action)
