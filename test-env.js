/**
 * Set up globals
 */
// jQuery
import $ from 'jquery'
import nock from 'nock'
import enableHooks from 'jest-react-hooks-shallow'

global.$ = $
global.jQuery = $

// Google Tag Manager dataLayer
global.dataLayer = {
  push: jest.fn()
}

// https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios/43020260#43020260
global.XMLHttpRequest = undefined

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

nock.cleanAll()
nock.disableNetConnect()

// Mock toast provider
window.reactToastProvider = {
  current: {
    add: jest.fn()
  }
}

enableHooks(jest, { dontMockByDefault: true })
