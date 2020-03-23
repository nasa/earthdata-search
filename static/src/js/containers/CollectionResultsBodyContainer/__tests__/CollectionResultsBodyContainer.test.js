import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { CollectionResultsBodyContainer } from '../CollectionResultsBodyContainer'
import CollectionResultsBody from '../../../components/CollectionResults/CollectionResultsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    browser: {
      name: 'browser name'
    },
    collections: { value: 'collections' },
    portal: {},
    project: {
      collectionIds: []
    },
    query: { pageNum: 1 },
    location: { value: 'location' },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onChangeCollectionPageNum: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    panelScrollableNodeRef: {
      current: null
    },
    panelView: 'list'
  }

  const enzymeWrapper = shallow(<CollectionResultsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsBodyContainer component', () => {
  test('passes its props and renders a single CollectionResultsBody component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionResultsBody).length).toBe(1)
    expect(enzymeWrapper.find(CollectionResultsBody).props().browser).toEqual({ name: 'browser name' })
    expect(enzymeWrapper.find(CollectionResultsBody).props().collections).toEqual({ value: 'collections' })
    expect(enzymeWrapper.find(CollectionResultsBody).props().projectIds).toEqual([])
    expect(enzymeWrapper.find(CollectionResultsBody).props().location).toEqual({ value: 'location' })
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onAddProjectCollection).toEqual('function')
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onRemoveCollectionFromProject).toEqual('function')
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onViewCollectionGranules).toEqual('function')
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onViewCollectionDetails).toEqual('function')
  })
})
