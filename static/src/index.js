import React from 'react'
import ReactDOM from 'react-dom'

import './css/main.scss'

import App from './js/App'

const wrapper = document.getElementById('root')

if (module.hot) module.hot.accept()

if (wrapper) {
  ReactDOM.render(
    <App />,
    wrapper
  )
}
