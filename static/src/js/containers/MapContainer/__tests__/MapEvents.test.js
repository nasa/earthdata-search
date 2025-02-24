import React from 'react'
import { render, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMap } from 'react-leaflet'
import MapEvents from '../MapEvents'

jest.mock('react-leaflet', () => ({
  useMap: jest.fn(),
  useMapEvents: jest.fn()
}))

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
    jest.clearAllMocks()

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

  test('tooltip renders only when moused over', async () => {
    const user = userEvent.setup()
    const { queryByText } = render(<MapEvents {...defaultProps} />)

    // eslint-disable-next-line no-underscore-dangle
    const placeLabelsControl = mockMap._controlContainer.querySelector('label')

    await act(async () => {
      await user.hover(placeLabelsControl)
    })

    expect(queryByText('This layer is currently disabled.')).toBeInTheDocument()

    await act(async () => {
      await user.unhover(placeLabelsControl)
    })

    expect(queryByText('This layer is currently disabled.')).not.toBeInTheDocument()
  })
})
