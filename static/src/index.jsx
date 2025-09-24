import './js/util/polyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'

import './css/main.scss'

import App from './js/App'

const root = ReactDOM.createRoot(document.getElementById('app'))

root.render(<App />)
