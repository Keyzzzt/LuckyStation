import { Provider } from 'react-redux'
import store from './store'
import ReactDOM from 'react-dom'
import './02_Styles/index.scss'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
