import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { mapDispatchToProps, GranuleResultsBodyContainer } from '../GranuleResultsBodyContainer'
import GranuleResultsBody from '../../../components/GranuleResults/GranuleResultsBody'
import * as metricsActions from '../../../middleware/metrics/actions'

jest.mock('../../../components/GranuleResults/GranuleResultsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsBodyContainer,
  defaultProps: {
    onMetricsDataAccess: jest.fn(),
    onMetricsAddGranuleProject: jest.fn(),
    panelView: 'list'
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId'
    },
    query: {
      collection: {
        byId: {
          collectionId: {}
        }
      },
      changeGranuleQuery: jest.fn(),
      excludeGranule: jest.fn()
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onMetricsDataAccess calls metricsActions.metricsDataAccess', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsActions, 'metricsDataAccess')

    mapDispatchToProps(dispatch).onMetricsDataAccess({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onMetricsAddGranuleProject calls metricsActions.metricsAddGranuleProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsActions, 'metricsAddGranuleProject')

    mapDispatchToProps(dispatch).onMetricsAddGranuleProject({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('GranuleResultsBodyContainer component', () => {
  test('passes its props and renders a single GranuleResultsBody component', () => {
    setup()

    expect(GranuleResultsBody).toHaveBeenCalledTimes(1)
    expect(GranuleResultsBody).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      directDistributionInformation: {},
      isOpenSearch: false,
      loadNextPage: expect.any(Function),
      onMetricsAddGranuleProject: expect.any(Function),
      onMetricsDataAccess: expect.any(Function),
      panelView: 'list'
    }, {})
  })

  test('loadNextPage calls onChangeGranulePageNum', () => {
    const { zustandState } = setup()

    GranuleResultsBody.mock.calls[0][0].loadNextPage()

    expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
    expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      query: {
        pageNum: 2
      }
    })
  })
})
