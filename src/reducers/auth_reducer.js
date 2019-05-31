import { AUTHENTICATED, UNAUTHENTICATED, AUTHENTICATION_ERROR } from '../actions/auth';

export default function(state={}, action) {
  switch(action.type) {
    case AUTHENTICATED:
      return { ...state, authenticated: true, username: action.username, usercode: action.usercode, password: action.password };
    case UNAUTHENTICATED:
      return { ...state, authenticated: false };
    case AUTHENTICATION_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
//  return state;
}
