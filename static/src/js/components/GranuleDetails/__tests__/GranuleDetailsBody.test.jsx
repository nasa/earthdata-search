import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import { granuleMetadata } from './mocks'

import GranuleDetailsBody from '../GranuleDetailsBody'
import GranuleDetailsInfo from '../GranuleDetailsInfo'
import GranuleDetailsMetadata from '../GranuleDetailsMetadata'

vi.mock('../GranuleDetailsInfo', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../GranuleDetailsMetadata', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: GranuleDetailsBody,
  defaultZustandState: {
    granule: {
      granuleId: 'G1422858365-ORNL_DAAC',
      granuleMetadata: {
        'G1422858365-ORNL_DAAC': granuleMetadata
      }
    }
  }
})

describe('GranuleDetailsBody component', () => {
  test('renders GranuleDetailsInfo and GranuleDetailsMetadata', () => {
    setup()

    expect(GranuleDetailsInfo).toHaveBeenCalledTimes(1)
    expect(GranuleDetailsInfo).toHaveBeenCalledWith({
      granuleMetadata
    }, {})

    expect(GranuleDetailsMetadata).toHaveBeenCalledTimes(1)
    expect(GranuleDetailsMetadata).toHaveBeenCalledWith({
      metadataUrls: granuleMetadata.metadataUrls
    }, {})
  })
})
