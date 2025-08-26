import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as actions from '../../../middleware/metrics/actions'
import GranuleResultsFocusedMeta from '../../../components/GranuleResults/GranuleResultsFocusedMeta'
import {
  GranuleResultsFocusedMetaContainer,
  mapDispatchToProps
} from '../GranuleResultsFocusedMetaContainer'

jest.mock('../../../components/GranuleResults/GranuleResultsFocusedMeta', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsFocusedMetaContainer,
  defaultProps: {
    onMetricsBrowseGranuleImage: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onMetricsBrowseGranuleImage calls metrics actions.metricsBrowseGranuleImage', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'metricsBrowseGranuleImage')

    mapDispatchToProps(dispatch).onMetricsBrowseGranuleImage({
      modalOpen: true,
      granuleId: 'G-1234-TEST',
      value: 'Test'
    })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      modalOpen: true,
      granuleId: 'G-1234-TEST',
      value: 'Test'
    })
  })
})

describe('GranuleResultsFocusedMetaContainer component', () => {
  test('passes its props and renders a single GranuleResultsFocusedMeta component', () => {
    const { props } = setup()

    expect(GranuleResultsFocusedMeta).toHaveBeenCalledTimes(1)
    expect(GranuleResultsFocusedMeta).toHaveBeenCalledWith({
      onMetricsBrowseGranuleImage: props.onMetricsBrowseGranuleImage
    }, {})
  })
})
