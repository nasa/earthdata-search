import './js/util/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import './css/main.scss'

import App from './js/App'

const rootElement = document.getElementById('root')
const appElement = document.getElementById('app')

if (rootElement) {
  ReactDOM.render(
    <App />,
    appElement,
    () => {
      window.requestAnimationFrame(() => {
        // Start to fade the loading screen
        rootElement.classList.add('root--loading-fade')

        // Remove the loading classes after the animation completes
        setTimeout(() => {
          rootElement.classList.remove('root--loading')
          rootElement.classList.remove('root--loading-fade')
        }, 150)
      })
    }
  )
}
