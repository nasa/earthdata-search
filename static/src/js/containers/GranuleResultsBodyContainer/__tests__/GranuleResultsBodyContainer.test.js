import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleResultsBodyContainer } from '../GranuleResultsBodyContainer'
import GranuleResultsBody from '../../../components/GranuleResults/GranuleResultsBody'

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
    expect(enzymeWrapper.find(GranuleResultsBody).props().isCwic).toEqual(false)
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
