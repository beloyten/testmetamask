import _ from 'lodash'
import state from './state'
import action from './action'
import apiKey from './apikey'
import infor from './info'

export default _.merge(state, action, apiKey, infor)
