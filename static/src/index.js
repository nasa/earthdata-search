import React from 'react'
import ReactDOM from 'react-dom'

import './css/main.scss'

import App from './js/App'
import './js/util/polyfill'

const wrapper = document.getElementById('root')


if (process.env.NODE_ENV === 'development' && module.hot) module.hot.accept()

if (wrapper) {
  ReactDOM.render(
    <App />,
    wrapper
  )
}
