import React from 'react'

import { render, screen } from '@testing-library/react'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'

import actions from '../../../actions'
import * as metricsSpatialSelection from '../../../middleware/metrics/actions'
import Providers from '../../../providers/Providers/Providers'

import {
  mapDispatchToProps,
  SpatialSelectionDropdownContainer
} from '../SpatialSelectionDropdownContainer'

const onChangePath = jest.fn()
const onChangeUrl = jest.fn()
const onToggleShapefileUploadModal = jest.fn()
const onMetricsSpatialSelection = jest.fn()
const history = createMemoryHistory()

const setup = () => {
  const props = {
    onChangeUrl,
    onChangePath,
    onToggleShapefileUploadModal,
    onMetricsSpatialSelection
  }

  render(
    <Providers>
      <Router history={history} location={props.location}>
        <SpatialSelectionDropdownContainer {...props} />
      </Router>
    </Providers>
  )
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
