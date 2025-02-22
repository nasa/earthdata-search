import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useMap } from 'react-leaflet'
import MapEvents from '../MapEvents'

// Mock react-leaflet like in your existing tests
jest.mock('react-leaflet', () => ({
  useMap: jest.fn(),
  useMapEvents: jest.fn()
}))

// Mock react-bootstrap since we're using Overlay and Tooltip
jest.mock('react-bootstrap', () => ({
  Overlay: ({ children, show, target }) => (show && target ? children({ placement: 'left' }) : null),
  // eslint-disable-next-line react/prop-types
  Tooltip: ({ children }) => <div>{children}</div>
}))

describe('MapEvents', () => {
  const defaultProps = {
    overlays: {},
    onChangeMap: jest.fn(),
    onMetricsMap: jest.fn()
  }

  let mockMap

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Create mock DOM structure
    mockMap = {
      _controlContainer: document.createElement('div'),
      getCenter: jest.fn().mockReturnValue({
        lat: 0,
        lng: 0
      }),
      getZoom: jest.fn().mockReturnValue(5)
    }

    const overlaysContainer = document.createElement('div')
    overlaysContainer.className = 'leaflet-control-layers-overlays'

    const placeLabelsControl = document.createElement('label')
    placeLabelsControl.textContent = 'Place Labels'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    placeLabelsControl.appendChild(checkbox)
    overlaysContainer.appendChild(placeLabelsControl)

    // eslint-disable-next-line no-underscore-dangle
    mockMap._controlContainer.appendChild(overlaysContainer)

    useMap.mockReturnValue(mockMap)
  })

  test('tooltip renders only when moused over', () => {
    const { queryByText } = render(<MapEvents {...defaultProps} />)

    // eslint-disable-next-line no-underscore-dangle
    const placeLabelsControl = mockMap._controlContainer.querySelector('label')

    fireEvent.mouseOver(placeLabelsControl)
    expect(queryByText('This layer is currently disabled.')).toBeInTheDocument()

    fireEvent.mouseOut(placeLabelsControl)
    expect(queryByText('This layer is currently disabled.')).not.toBeInTheDocument()
  })
})
