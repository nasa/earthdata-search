import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { useMap } from 'react-leaflet'

import MapEvents from '../MapEvents'

// Mock JSDOM interactions
const mockControlContainer = () => {
  <div />
}

mockControlContainer.querySelector = () => {
  <div />
}

const mockInvalidateSize = jest.fn()

jest.mock('react-leaflet', () => ({
  useMap: jest.fn(() => ({
    invalidateSize: mockInvalidateSize,
    getCenter: jest.fn(() => ({
      lat: 0,
      lng: 0
    })),
    getZoom: jest.fn(() => 1),
    _controlContainer: mockControlContainer
  })),
  useMapEvents: jest.fn()
}))

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

const setup = () => {
  const container = render(
    <div className="panels">
      <div className="sidebar">
        <MapEvents
          overlays={{}}
          onChangeMap={() => {}}
          onMetricsMap={() => {}}
        />
      </div>
    </div>
  )

  return {
    container
  }
}

describe('MapEvents component', () => {
  test('calls map.invalidateSize on "mapOffsetChanged" event', () => {
    setup()

    window.dispatchEvent(new Event('mapOffsetChanged'))

    expect(useMap).toHaveBeenCalledTimes(1)
    expect(mockInvalidateSize).toHaveBeenCalledTimes(1)
  })

  test('removes the "mapOffsetChanged" event listener on unmount', () => {
    const { container } = setup()

    container.unmount()

    window.dispatchEvent(new Event('mapOffsetChanged'))

    expect(mockInvalidateSize).not.toHaveBeenCalled()
    expect(mockInvalidateSize).toHaveBeenCalledTimes(0)
  })
})
