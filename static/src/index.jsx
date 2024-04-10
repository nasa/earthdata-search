import './js/util/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import { isBrowserCompatible } from './js/util/isBrowserCompatible'

import './css/main.scss'

import App from './js/App'

// Only bootstrap the app if the browser is compatible
if (isBrowserCompatible()) {
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
}
