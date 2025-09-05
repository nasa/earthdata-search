import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import * as metricsSpatialSelection from '../../../middleware/metrics/actions'

import {
  mapDispatchToProps,
  SpatialSelectionDropdownContainer
} from '../SpatialSelectionDropdownContainer'

const setup = setupTest({
  Component: SpatialSelectionDropdownContainer,
  defaultProps: {
    onChangeUrl: jest.fn(),
    onChangePath: jest.fn(),
    onToggleShapefileUploadModal: jest.fn(),
    onMetricsSpatialSelection: jest.fn()
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })

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
