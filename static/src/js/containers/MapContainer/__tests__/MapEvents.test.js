import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { useMap } from 'react-leaflet'
import MapEvents from '../MapEvents'

jest.mock('react-leaflet', () => ({
  useMap: jest.fn(),
  useMapEvents: jest.fn().mockImplementation(() => {})
}))

describe('MapEvents component', () => {
  let fakeMap

  beforeEach(() => {
    const controlContainer = document.createElement('div')
    const layersControlDiv = document.createElement('div')

    layersControlDiv.classList.add('leaflet-control-layers-list')
    controlContainer.appendChild(layersControlDiv)

    fakeMap = {
      invalidateSize: jest.fn(),
      getCenter: () => ({
        lat: 0,
        lng: 0
      }),
      getZoom: () => 1,

      _controlContainer: controlContainer
    }

    useMap.mockReturnValue(fakeMap)
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('calls map.invalidateSize on "mapOffsetChanged" event', () => {
    render(
      <MapEvents
        overlays={{}}
        onChangeMap={() => {}}
        onMetricsMap={() => {}}
      />
    )

    window.dispatchEvent(new Event('mapOffsetChanged'))

    expect(fakeMap.invalidateSize).toHaveBeenCalled()
  })

  test('removes the "mapOffsetChanged" event listener on unmount', () => {
    const { unmount } = render(
      <MapEvents
        overlays={{}}
        onChangeMap={() => {}}
        onMetricsMap={() => {}}
      />
    )

    unmount()

    fakeMap.invalidateSize.mockClear()
    window.dispatchEvent(new Event('mapOffsetChanged'))

    expect(fakeMap.invalidateSize).not.toHaveBeenCalled()
  })
})
