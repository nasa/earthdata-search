import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as metricsActions from '../../../middleware/metrics/actions'

import {
  CollectionResultsBodyContainer,
  mapDispatchToProps
} from '../CollectionResultsBodyContainer'
import CollectionResultsBody from '../../../components/CollectionResults/CollectionResultsBody'

jest.mock('../../../components/CollectionResults/CollectionResultsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: CollectionResultsBodyContainer,
  defaultProps: {
    onMetricsAddCollectionProject: jest.fn(),
    panelView: 'list'
  },
  defaultZustandState: {
    query: {
      changeQuery: jest.fn()
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onMetricsAddCollectionProject calls metricsActions.metricsAddCollectionProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsActions, 'metricsAddCollectionProject')

    mapDispatchToProps(dispatch).onMetricsAddCollectionProject({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('CollectionResultsBodyContainer component', () => {
  test('passes its props and renders a single CollectionResultsBody component', () => {
    setup()

    expect(CollectionResultsBody).toHaveBeenCalledTimes(1)
    expect(CollectionResultsBody).toHaveBeenCalledWith({
      loadNextPage: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      panelView: 'list'
    }, {})
  })

  test('loadNextPage calls changeQuery', async () => {
    const { zustandState } = setup()

    CollectionResultsBody.mock.calls[0][0].loadNextPage()

    expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        pageNum: 2
      }
    })
  })
})
