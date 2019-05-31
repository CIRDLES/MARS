
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import App from './app'
import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './reducers'
import { loadState, saveState } from './localstorage';

export const history = createHistory()

const persistedState = loadState();
//const initialState = {}

const enhancers = []
const middleware = [
  thunk,
  routerMiddleware(history)
]


if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
  
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }
  
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )
  
  const store = createStore(
    connectRouter(history)(rootReducer),
    persistedState,
    composedEnhancers
  )

store.subscribe(() => {
    console.log(store)
    saveState({
        auth: store.getState().auth
    });
    });
    


const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
)
