import React from 'react'

import { screen, render } from '@testing-library/react'

import * as actions from '../../../middleware/metrics/actions'
import GranuleResultsFocusedMeta from '../../../components/GranuleResults/GranuleResultsFocusedMeta'
import {
  GranuleResultsFocusedMetaContainer,
  mapDispatchToProps
} from '../GranuleResultsFocusedMetaContainer'

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

describe('mapDispatchToProps', () => {
  test('onMetricsBrowseGranuleImage calls metrics actions.metricsBrowseGranuleImage', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'metricsBrowseGranuleImage')

    mapDispatchToProps(dispatch).onMetricsBrowseGranuleImage({
      modalOpen: true,
      granuleId: 'G-1234-TEST',
      value: 'Test'
    })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({
      modalOpen: true,
      granuleId: 'G-1234-TEST',
      value: 'Test'
    })
  })
})

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
