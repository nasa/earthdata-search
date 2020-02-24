import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { CollectionResultsHeaderContainer } from '../CollectionResultsHeaderContainer'
import CollectionResultsHeader from '../../../components/CollectionResults/CollectionResultsHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {},
    collectionQuery: {},
    portal: {
      portalId: ''
    },
    onChangeQuery: jest.fn(),
    onMetricsCollectionSortChange: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn()
  }

  const enzymeWrapper = shallow(<CollectionResultsHeaderContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsHeaderContainer component', () => {
  test('passes its props and renders a single CollectionResultsHeader component', () => {
    const { enzymeWrapper, props } = setup()
    expect(enzymeWrapper.find(CollectionResultsHeader).length).toBe(1)
    expect(enzymeWrapper.find(CollectionResultsHeader).props().portal).toEqual({ portalId: '' })
    expect(enzymeWrapper.find(CollectionResultsHeader).props().onToggleAdvancedSearchModal)
      .toEqual(props.onToggleAdvancedSearchModal)
  })
})
