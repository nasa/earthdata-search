import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { granuleResultsBodyProps } from './mocks'

import GranuleDetailsBody from '../GranuleDetailsBody'
import GranuleDetailsInfo from '../GranuleDetailsInfo'
import GranuleDetailsMetadata from '../GranuleDetailsMetadata'

jest.mock('../GranuleDetailsInfo', () => jest.fn(() => <div />))
jest.mock('../GranuleDetailsMetadata', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleDetailsBody,
  defaultProps: granuleResultsBodyProps
})

describe('GranuleDetailsBody component', () => {
  test('renders GranuleDetailsInfo and GranuleDetailsMetadata', () => {
    setup()

    expect(GranuleDetailsInfo).toHaveBeenCalledTimes(1)
    expect(GranuleDetailsInfo).toHaveBeenCalledWith({
      granuleMetadata: granuleResultsBodyProps.granuleMetadata
    }, {})

    expect(GranuleDetailsMetadata).toHaveBeenCalledTimes(1)
    expect(GranuleDetailsMetadata).toHaveBeenCalledWith({
      authToken: granuleResultsBodyProps.authToken,
      metadataUrls: granuleResultsBodyProps.granuleMetadata.metadataUrls
    }, {})
  })
})
