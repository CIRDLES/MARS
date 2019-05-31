
import { combineReducers } from 'redux'
import counter from '../actions/counter'
import history from '../history'
import { connectRouter } from 'connected-react-router'
export default combineReducers({
  counter,
  router: connectRouter(history)
})