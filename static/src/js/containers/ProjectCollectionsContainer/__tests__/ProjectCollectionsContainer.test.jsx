import React from 'react'

import { mapDispatchToProps, ProjectCollectionsContainer } from '../ProjectCollectionsContainer'
import ProjectCollections from '../../../components/ProjectCollections/ProjectCollections'
import * as metricsDataAccess from '../../../middleware/metrics/actions'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/ProjectCollections/ProjectCollections', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ProjectCollectionsContainer,
  defaultProps: {
    onMetricsDataAccess: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onMetricsDataAccess calls metricsDataAccess', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsDataAccess, 'metricsDataAccess')

    mapDispatchToProps(dispatch).onMetricsDataAccess({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('ProjectCollectionsContainer component', () => {
  test('passes its props and renders a single ProjectCollections component', () => {
    setup()

    expect(ProjectCollections).toHaveBeenCalledTimes(1)
    expect(ProjectCollections).toHaveBeenCalledWith({
      onMetricsDataAccess: expect.any(Function)
    }, {})
  })
})
