import _ from 'lodash'
import state from './state'
import setter from './setter'
export default _.merge(state, setter)
