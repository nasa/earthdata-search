import React from 'react'

import { render, screen } from '@testing-library/react'

import actions from '../../../actions'
import * as metricsSpatialSelection from '../../../middleware/metrics/actions'

import {
  mapDispatchToProps,
  SpatialSelectionDropdownContainer
} from '../SpatialSelectionDropdownContainer'

const onToggleShapefileUploadModal = jest.fn()
const onMetricsSpatialSelection = jest.fn()

const setup = () => {
  const props = {
    onToggleShapefileUploadModal,
    onMetricsSpatialSelection
  }

  render(<SpatialSelectionDropdownContainer {...props} />)
}

describe('mapDispatchToProps', () => {
  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })

  test('onMetricsSpatialSelection calls metricsSpatialSelection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsSpatialSelection, 'metricsSpatialSelection')

    mapDispatchToProps(dispatch).onMetricsSpatialSelection({ item: 'value' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ item: 'value' })
  })
})

describe('SpatialSelectionDropdownContainer component', () => {
  test('passes its props and renders a single SpatialSelectionDropdown component', () => {
    setup()

    expect(screen.getByRole('button', { name: 'spatial-selection-dropdown' })).toBeInTheDocument()
  })
})
