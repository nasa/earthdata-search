import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as metricsSpatialSelection from '../../../middleware/metrics/actions'

import {
  mapDispatchToProps,
  SpatialSelectionDropdownContainer
} from '../SpatialSelectionDropdownContainer'

const setup = setupTest({
  Component: SpatialSelectionDropdownContainer,
  defaultProps: {
    onMetricsSpatialSelection: jest.fn()
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onMetricsSpatialSelection calls metricsSpatialSelection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsSpatialSelection, 'metricsSpatialSelection')

    mapDispatchToProps(dispatch).onMetricsSpatialSelection({ item: 'value' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ item: 'value' })
  })
})

describe('SpatialSelectionDropdownContainer component', () => {
  test('passes its props and renders a single SpatialSelectionDropdown component', () => {
    setup()

    expect(screen.getByRole('button', { name: 'spatial-selection-dropdown' })).toBeInTheDocument()
  })
})
