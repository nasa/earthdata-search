/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Set up globals
 */
import { expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

import nock from 'nock'

import '@testing-library/jest-dom'

import '@testing-library/jest-dom/vitest'

// Loads the zustand mock from __mocks__/zustand.ts
vi.mock('zustand')

expect.extend(matchers);

// Google Tag Manager dataLayer
(global as any).dataLayer = {
  push: vi.fn()
}

global.fetch = vi.fn();

// https://stackoverflow.com/questions/42677387/jest-returns-network-error-when-doing-an-authenticated-request-with-axios/43020260#43020260
(global as any).XMLHttpRequest = undefined

nock.cleanAll()
nock.disableNetConnect();

// Mock toast provider
(global as any).reactToastProvider = {
  current: {
    add: vi.fn()
  }
}

global.ResizeObserver = vi.fn(class {
  observe = vi.fn()

  unobserve = vi.fn()

  disconnect = vi.fn()
})

vi.mock('../static/src/js/router/router', async () => ({
  default: {
    router: {
      navigate: vi.fn(),
      state: {
        location: {
          pathname: '',
          search: ''
        }
      },
      subscribe: vi.fn()
    }
  }
}))

// Mock the availablePortals file
// eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
const mockedPortals = vi.hoisted(() => require('../portals/__mocks__/availablePortals.json'))
vi.mock('../portals/availablePortals.json', () => ({ default: mockedPortals }))

// TODO? Loop through assets images and mock them
const fileMock = { default: 'test-file-stub' }
vi.mock('../static/src/assets/images/earthdata-search-og-image.jpg?format=webp', () => fileMock)
vi.mock('../static/src/assets/images/image-unavailable.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/atmosphere-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/biosphere-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/climate-indicators-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/cryosphere-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/human-dimensions-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/land-surface-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/ocean-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/solid-earth-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/sun-earth-interactions-icon.svg', () => fileMock)
vi.mock('../static/src/assets/images/homepage-topic-icons/terrestrial-hydrosphere-icon.svg', () => fileMock)
