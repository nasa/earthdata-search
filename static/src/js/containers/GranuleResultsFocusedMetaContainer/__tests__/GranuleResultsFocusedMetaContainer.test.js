import React from 'react'

import { screen, render } from '@testing-library/react'

import '@testing-library/jest-dom'
import { GranuleResultsFocusedMetaContainer } from '../GranuleResultsFocusedMetaContainer'
import GranuleResultsFocusedMeta from '../../../components/GranuleResults/GranuleResultsFocusedMeta'

jest.mock('../../../components/GranuleResults/GranuleResultsFocusedMeta', () => jest.fn(() => <div data-testid="granule-results-focused-meta-overlay-wrapper" />))

const setup = (overrideProps) => {
  const onMetricsBrowseGranuleImage = jest.fn()
  const props = {
    focusedGranuleMetadata: { test: 'test' },
    focusedGranuleId: '1234-TEST',
    onMetricsBrowseGranuleImage,
    ...overrideProps
  }

  render(<GranuleResultsFocusedMetaContainer {...props} />)

  return { onMetricsBrowseGranuleImage }
}

describe('GranuleResultsFocusedMetaContainer component', () => {
  test('passes its props and renders a single GranuleResultsFocusedMeta component', () => {
    const { onMetricsBrowseGranuleImage } = setup()

    expect(screen.getByTestId('granule-results-focused-meta-overlay-wrapper')).toBeInTheDocument()
    expect(GranuleResultsFocusedMeta).toHaveBeenCalledTimes(1)

    // Using the `toHaveBeenCalledWith` assertion also have the deprecated react context object in it making it less readable
    expect(GranuleResultsFocusedMeta.mock.calls[0][0]).toEqual({
      focusedGranuleMetadata: { test: 'test' },
      focusedGranuleId: '1234-TEST',
      onMetricsBrowseGranuleImage
    })
  })
})
