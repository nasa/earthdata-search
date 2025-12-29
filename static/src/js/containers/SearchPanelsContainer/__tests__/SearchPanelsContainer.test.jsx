import React from 'react'

import { screen } from '@testing-library/react'

import SearchPanels from '../../../components/SearchPanels/SearchPanels'
import SearchPanelsContainer from '../SearchPanelsContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/SearchPanels/SearchPanels', () => jest.fn(() => <div>Search Panels</div>))

const setup = setupTest({
  Component: SearchPanelsContainer,
  defaultZustandState: {
    preferences: {
      preferences: {
        panelState: 'default',
        collectionListView: 'default',
        granuleListView: 'default',
        collectionSort: 'default',
        granuleSort: 'default',
        mapView: {
          zoom: 3,
          latitude: 0,
          longitude: 0,
          projection: 'epsg4326',
          baseLayer: 'worldImagery',
          overlayLayers: ['bordersRoads', 'placeLabels'],
          rotation: 0
        }
      }
    }
  },
  withRouter: true
})

describe('SearchPanelsContainer component', () => {
  test('passes its props and renders a single SearchPanels component', async () => {
    setup()

    const panels = await screen.findByText('Search Panels')

    expect(panels).toBeInTheDocument()
    expect(SearchPanels).toHaveBeenCalledTimes(1)
    expect(SearchPanels).toHaveBeenCalledWith(
      {},
      {}
    )
  })
})
