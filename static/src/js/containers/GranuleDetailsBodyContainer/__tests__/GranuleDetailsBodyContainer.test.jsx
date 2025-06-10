import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { GranuleDetailsBodyContainer, mapStateToProps } from '../GranuleDetailsBodyContainer'
import GranuleDetailsBody from '../../../components/GranuleDetails/GranuleDetailsBody'

jest.mock('../../../components/GranuleDetails/GranuleDetailsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleDetailsBodyContainer,
  defaultProps: {
    authToken: '',
    earthdataEnvironment: 'prod',
    granuleMetadata: {
      metadataUrls: {
        atom: 'https://cmr.earthdata.nasa.gov/search/concepts/focusedGranule.atom'
      }
    }
  }
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      metadata: {
        granules: {}
      }
    }

    const expectedState = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      granuleMetadata: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsBodyContainer component', () => {
  describe('when passed granule metadata', () => {
    test('passes its props and renders a single GranuleResultsBody component', () => {
      setup()

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(1)
      expect(GranuleDetailsBody).toHaveBeenCalledWith(
        expect.objectContaining({
          authToken: '',
          earthdataEnvironment: 'prod',
          granuleMetadata: {
            metadataUrls: {
              atom: 'https://cmr.earthdata.nasa.gov/search/concepts/focusedGranule.atom'
            }
          }
        }),
        {}
      )
    })
  })
})
