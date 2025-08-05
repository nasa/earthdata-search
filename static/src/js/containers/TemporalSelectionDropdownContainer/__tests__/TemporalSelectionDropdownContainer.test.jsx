import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as metricActions from '../../../middleware/metrics/actions'
import {
  mapDispatchToProps,
  TemporalSelectionDropdownContainer
} from '../TemporalSelectionDropdownContainer'
import TemporalSelectionDropdown from '../../../components/TemporalDisplay/TemporalSelectionDropdown'

jest.mock('../../../components/TemporalDisplay/TemporalSelectionDropdown', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: TemporalSelectionDropdownContainer,
  defaultProps: {
    searchParams: {},
    onMetricsTemporalFilter: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onMetricsTemporalFilter calls metricsTemporalFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricActions, 'metricsTemporalFilter')

    mapDispatchToProps(dispatch).onMetricsTemporalFilter({ metric: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ metric: 'data' })
  })
})

describe('TemporalSelectionDropdownContainer component', () => {
  test('passes its props and renders a single TemporalSelectionDropdown component', () => {
    setup()

    expect(TemporalSelectionDropdown).toHaveBeenCalledTimes(1)
    expect(TemporalSelectionDropdown).toHaveBeenCalledWith({
      searchParams: {},
      onChangeQuery: expect.any(Function),
      onMetricsTemporalFilter: expect.any(Function)
    }, {})
  })
})
