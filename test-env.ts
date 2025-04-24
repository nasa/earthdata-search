/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Set up globals
 */
import nock from 'nock'
import enableHooks from 'jest-react-hooks-shallow'

import '@testing-library/jest-dom'

import { TextEncoder, TextDecoder } from 'util'

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Google Tag Manager dataLayer
(global as any).dataLayer = {
  push: jest.fn()
};

// https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios/43020260#43020260
(global as any).XMLHttpRequest = undefined

/**
 * Set up console.error override
 */
const { error } = console

const consoleError = function errorOverride(message: unknown) {
  // eslint-disable-next-line prefer-rest-params
  error.apply(console, arguments as any) // Keep default behaviour
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

enableHooks(jest, { dontMockByDefault: true })
