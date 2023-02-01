import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, GranuleResultsBodyContainer } from '../GranuleResultsBodyContainer'
import GranuleResultsBody from '../../../components/GranuleResults/GranuleResultsBody'
import * as metricsDataAccess from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionMetadata: {},
    focusedCollectionId: 'focusedCollection',
    focusedGranuleId: '',
    granuleQuery: { pageNum: 1 },
    granuleSearchResults: {},
    granulesMetadata: {},
    location: { search: 'value' },
    onAddGranuleToProjectCollection: jest.fn(),
    onChangeGranulePageNum: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    panelView: 'list',
    portal: {},
    project: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeGranulePageNum calls actions.changeGranulePageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeGranulePageNum')

    mapDispatchToProps(dispatch).onChangeGranulePageNum({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onExcludeGranule calls actions.excludeGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'excludeGranule')

    mapDispatchToProps(dispatch).onExcludeGranule({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onFocusedGranuleChange calls actions.changeFocusedGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedGranule')

    mapDispatchToProps(dispatch).onFocusedGranuleChange('granuleId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('granuleId')
  })

  test('onMetricsDataAccess calls metricsDataAccess', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsDataAccess, 'metricsDataAccess')

    mapDispatchToProps(dispatch).onMetricsDataAccess({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onAddGranuleToProjectCollection calls actions.addGranuleToProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'addGranuleToProjectCollection')

    mapDispatchToProps(dispatch).onAddGranuleToProjectCollection({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onRemoveGranuleFromProjectCollection calls actions.removeGranuleFromProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeGranuleFromProjectCollection')

    mapDispatchToProps(dispatch).onRemoveGranuleFromProjectCollection({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
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
          temporal: {}
        }
      },
      portal: {},
      project: {}
    }

    const expectedState = {
      collectionMetadata: {},
      focusedCollectionId: 'collectionId',
      focusedGranuleId: 'granuleId',
      granuleQuery: {},
      granuleSearchResults: {},
      granulesMetadata: {},
      portal: {},
      project: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsBodyContainer component', () => {
  test('passes its props and renders a single GranuleResultsBody component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsBody).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsBody).props().collectionId).toEqual('focusedCollection')
    expect(enzymeWrapper.find(GranuleResultsBody).props().focusedGranuleId).toEqual('')
    expect(enzymeWrapper.find(GranuleResultsBody).props().granuleQuery).toEqual({
      pageNum: 1
    })
    expect(enzymeWrapper.find(GranuleResultsBody).props().granulesMetadata).toEqual({})
    expect(enzymeWrapper.find(GranuleResultsBody).props().granuleSearchResults).toEqual({})
    expect(enzymeWrapper.find(GranuleResultsBody).props().isOpenSearch).toEqual(false)
    expect(enzymeWrapper.find(GranuleResultsBody).props().portal).toEqual({})
    expect(enzymeWrapper.find(GranuleResultsBody).props().project).toEqual({})
  })

  test('loadNextPage calls onChangeGranulePageNum', () => {
    const { enzymeWrapper, props } = setup()

    const granuleResultsBody = enzymeWrapper.find(GranuleResultsBody)

    granuleResultsBody.prop('loadNextPage')()

    expect(props.onChangeGranulePageNum.mock.calls.length).toBe(1)
    expect(props.onChangeGranulePageNum.mock.calls[0]).toEqual([{
      collectionId: 'focusedCollection',
      pageNum: 2
    }])
  })
})
