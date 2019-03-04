import React from 'react'
import ReactDOM from 'react-dom'

import './css/main.scss'

import App from './js/App'

const wrapper = document.getElementById('root')

if (wrapper) {
  ReactDOM.render(
    <App />,
    wrapper
  )
}
