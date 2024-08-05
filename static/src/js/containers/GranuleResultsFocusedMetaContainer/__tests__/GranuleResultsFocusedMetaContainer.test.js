import React from 'react'

import { screen, render } from '@testing-library/react'

import '@testing-library/jest-dom'
import { GranuleResultsFocusedMetaContainer } from '../GranuleResultsFocusedMetaContainer'

const setup = (overrideProps) => {
  const props = {
    focusedGranuleMetadata: { test: 'test' },
    focusedGranuleId: '1234-TEST',
    onMetricsBrowseGranuleImage: jest.fn(),
    ...overrideProps
  }

  render(<GranuleResultsFocusedMetaContainer {...props} />)
}

describe('GranuleResultsFocusedMetaContainer component', () => {
  test('passes its props and renders a single GranuleResultsFocusedMeta component', () => {
    setup()
    screen.debug()
    expect(screen.getByTestId('granule-results-focused-meta-overlay-wrapper')).toBeInTheDocument()
  })
})
