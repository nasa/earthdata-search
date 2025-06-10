import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  GranuleResultsBodyContainer
} from '../GranuleResultsBodyContainer'
import GranuleResultsBody from '../../../components/GranuleResults/GranuleResultsBody'
import * as metricsActions from '../../../middleware/metrics/actions'

jest.mock('../../../components/GranuleResults/GranuleResultsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsBodyContainer,
  defaultProps: {
    collectionMetadata: {},
    collectionQuerySpatial: {},
    collectionTags: {},
    focusedCollectionId: 'focusedCollection',
    focusedGranuleId: '',
    generateNotebook: {},
    granuleQuery: { pageNum: 1 },
    granuleSearchResults: {},
    granulesMetadata: {},
    location: { search: 'value' },
    onAddGranuleToProjectCollection: jest.fn(),
    onChangeGranulePageNum: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onGenerateNotebook: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onMetricsAddGranuleProject: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    panelView: 'list',
    project: {}
  }
})

describe('mapDispatchToProps', () => {
  test('onChangeGranulePageNum calls actions.changeGranulePageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeGranulePageNum')

    mapDispatchToProps(dispatch).onChangeGranulePageNum({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onExcludeGranule calls actions.excludeGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'excludeGranule')

    mapDispatchToProps(dispatch).onExcludeGranule({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onFocusedGranuleChange calls actions.changeFocusedGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedGranule')

    mapDispatchToProps(dispatch).onFocusedGranuleChange('granuleId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('granuleId')
  })

  test('onGenerateNotebook calls actions.generateNotebook', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'generateNotebook')

    mapDispatchToProps(dispatch).onGenerateNotebook({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

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

  test('onAddGranuleToProjectCollection calls actions.addGranuleToProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'addGranuleToProjectCollection')

    mapDispatchToProps(dispatch).onAddGranuleToProjectCollection({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onRemoveGranuleFromProjectCollection calls actions.removeGranuleFromProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeGranuleFromProjectCollection')

    mapDispatchToProps(dispatch).onRemoveGranuleFromProjectCollection({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId',
      query: {
        collection: {
          byId: {
            collectionId: {
              granule: {}
            }
          },
          spatial: {},
          temporal: {}
        }
      },
      project: {},
      ui: {
        generateNotebook: {}
      }
    }

    const expectedState = {
      collectionMetadata: {},
      collectionTags: {},
      collectionQuerySpatial: {},
      focusedCollectionId: 'collectionId',
      focusedGranuleId: 'granuleId',
      generateNotebook: {},
      granuleQuery: {},
      granuleSearchResults: {},
      granulesMetadata: {},
      project: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsBodyContainer component', () => {
  test('passes its props and renders a single GranuleResultsBody component', () => {
    setup()

    expect(GranuleResultsBody).toHaveBeenCalledTimes(1)
    expect(GranuleResultsBody).toHaveBeenCalledWith({
      collectionId: 'focusedCollection',
      collectionQuerySpatial: {},
      collectionTags: {},
      directDistributionInformation: {},
      focusedGranuleId: '',
      generateNotebook: {},
      granuleQuery: { pageNum: 1 },
      granuleSearchResults: {},
      granulesMetadata: {},
      isOpenSearch: false,
      loadNextPage: expect.any(Function),
      location: { search: 'value' },
      onAddGranuleToProjectCollection: expect.any(Function),
      onExcludeGranule: expect.any(Function),
      onFocusedGranuleChange: expect.any(Function),
      onGenerateNotebook: expect.any(Function),
      onMetricsAddGranuleProject: expect.any(Function),
      onMetricsDataAccess: expect.any(Function),
      onRemoveGranuleFromProjectCollection: expect.any(Function),
      panelView: 'list',
      project: {}
    }, {})
  })

  test('loadNextPage calls onChangeGranulePageNum', () => {
    const { props } = setup()

    GranuleResultsBody.mock.calls[0][0].loadNextPage()

    expect(props.onChangeGranulePageNum).toHaveBeenCalledTimes(1)
    expect(props.onChangeGranulePageNum).toHaveBeenCalledWith({
      collectionId: 'focusedCollection',
      pageNum: 2
    })
  })
})
