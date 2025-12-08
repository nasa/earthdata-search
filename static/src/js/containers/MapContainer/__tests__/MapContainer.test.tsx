import React from 'react'

import { mapDispatchToProps } from '../MapContainer'

// @ts-expect-error The file does not have types
import * as metricsMap from '../../../middleware/metrics/actions'

// Mock Map because openlayers causes errors
jest.mock('../../../components/Map/Map', () => <div />)

describe('mapDispatchToProps', () => {
  test('onMetricsMap calls metricsMap', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsMap, 'metricsMap')

    mapDispatchToProps(dispatch).onMetricsMap('mockType')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mockType')
  })
})
