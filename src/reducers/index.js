
import { combineReducers } from 'redux'
import authReducer from './auth_reducer'
import { reducer as formReducer } from 'redux-form';

import history from '../history'
import { connectRouter } from 'connected-react-router'
export default combineReducers({
  auth: authReducer,
  form: formReducer,
  router: connectRouter(history)
})