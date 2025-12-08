import React from 'react'
import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as metrics from '../../../middleware/metrics/actions'
import {
  CollectionDetailsBodyContainer,
  mapDispatchToProps
} from '../CollectionDetailsBodyContainer'
import CollectionDetailsBody from '../../../components/CollectionDetails/CollectionDetailsBody'

jest.mock('../../../components/CollectionDetails/CollectionDetailsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: CollectionDetailsBodyContainer,
  defaultProps: {
    isActive: true,
    onMetricsRelatedCollection: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onMetricsRelatedCollection calls metricsRelatedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metrics, 'metricsRelatedCollection')

    mapDispatchToProps(dispatch).onMetricsRelatedCollection({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('CollectionDetailsBodyContainer component', () => {
  test('passes its props and renders a single CollectionDetailsBody component', async () => {
    setup()

    await waitFor(() => {
      expect(CollectionDetailsBody).toHaveBeenCalledTimes(1)
    })

    expect(CollectionDetailsBody).toHaveBeenCalledWith({
      isActive: true,
      onMetricsRelatedCollection: expect.any(Function)
    }, {})
  })
})
