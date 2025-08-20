import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { GranuleDetailsBodyContainer, mapStateToProps } from '../GranuleDetailsBodyContainer'
import GranuleDetailsBody from '../../../components/GranuleDetails/GranuleDetailsBody'

jest.mock('../../../components/GranuleDetails/GranuleDetailsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleDetailsBodyContainer,
  defaultProps: {
    authToken: ''
  }
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token'
    }

    const expectedState = {
      authToken: 'mock-token'
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsBodyContainer component', () => {
  describe('when passed granule metadata', () => {
    test('passes its props and renders a single GranuleResultsBody component', () => {
      setup()

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(1)
      expect(GranuleDetailsBody).toHaveBeenCalledWith({
        authToken: ''
      }, {})
    })
  })
})
