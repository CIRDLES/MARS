
import { combineReducers } from 'redux'
import authReducer from './auth_reducer'
import { reducer as formReducer } from 'redux-form';
import uploadReducer from './upload_reducer';
import mappingReducer from './mapping_reducer';

import history from '../history'
import { connectRouter } from 'connected-react-router'
export default combineReducers({
  auth: authReducer,
  form: formReducer,
  upload: uploadReducer,
  mapping: mappingReducer,
  router: connectRouter(history)
})