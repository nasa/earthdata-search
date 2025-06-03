import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import * as metricsSpatialSelection from '../../../middleware/metrics/actions'

import {
  mapDispatchToProps,
  SpatialSelectionDropdownContainer
} from '../SpatialSelectionDropdownContainer'
import SpatialSelectionDropdown from '../../../components/SpatialDisplay/SpatialSelectionDropdown'

jest.mock('../../../components/SpatialDisplay/SpatialSelectionDropdown', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SpatialSelectionDropdownContainer,
  defaultProps: {
    searchParams: {},
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

    expect(SpatialSelectionDropdown).toHaveBeenCalledTimes(1)
    expect(SpatialSelectionDropdown).toHaveBeenCalledWith({
      searchParams: {},
      onChangeUrl: expect.any(Function),
      onChangePath: expect.any(Function),
      onToggleShapefileUploadModal: expect.any(Function),
      onMetricsSpatialSelection: expect.any(Function)
    }, {})
  })
})
