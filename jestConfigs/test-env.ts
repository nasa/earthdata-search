/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Set up globals
 */
import nock from 'nock'

import '@testing-library/jest-dom'

import { TextEncoder, TextDecoder } from 'util'

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Google Tag Manager dataLayer
(global as any).dataLayer = {
  push: jest.fn()
}

global.fetch = jest.fn();

// https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios/43020260#43020260
(global as any).XMLHttpRequest = undefined

/**
 * Set up console.error override
 */
const { error } = console

const consoleError = function errorOverride(message: unknown) {
  // eslint-disable-next-line prefer-rest-params
  error.apply(console, arguments as any) // Keep default behaviour

  // Suppress errors from libraries using findDOMNode
  if (String(message).includes('findDOMNode is deprecated')) return

  throw (message instanceof Error ? message : new Error(String(message)))
};

(console as any).error = consoleError

nock.cleanAll()
nock.disableNetConnect();

// Mock toast provider
(global as any).reactToastProvider = {
  current: {
    add: jest.fn()
  }
}

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

jest.mock('../static/src/js/router/router', () => ({
  ...jest.requireActual('../static/src/js/router/router'),
  router: {
    navigate: jest.fn(),
    state: {
      location: {
        pathname: '',
        search: ''
      }
    },
    subscribe: jest.fn()
  }
}))
