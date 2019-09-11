/**
 * Set up globals
 */
// jQuery
import $ from 'jquery'

global.$ = $
global.jQuery = $

// Google Tag Manager dataLayer
global.dataLayer = {
  push: jest.fn()
}


/**
 * Set up console.error override
 */
const { error } = console

const consoleError = function errorOverride(message) {
  // eslint-disable-next-line prefer-rest-params
  error.apply(console, arguments) // keep default behaviour
  throw (message instanceof Error ? message : new Error(message))
}

console.error = consoleError
