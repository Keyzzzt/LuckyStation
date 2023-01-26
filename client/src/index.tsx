import { Provider } from 'react-redux'
import store from './store'
import ReactDOM from 'react-dom'
import './02_Styles/index.scss'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

ReactDOM.render(
  <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
  </Provider>,

  document.getElementById('root'),
)
