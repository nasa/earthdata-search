import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleResultsActionsContainer } from '../GranuleResultsActionsContainer'
import GranuleResultsActions from '../../../components/GranuleResults/GranuleResultsActions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: { search: 'value' },
    collections: {
      allIds: ['focusedCollection'],
      byId: {
        focusedCollection: {
          excludedGranuleIds: [],
          granules: { hits: 100 },
          metadata: {
            mock: 'data'
          }
        }
      }
    },
    focusedCollection: 'focusedCollection',
    granuleQuery: {
      pageNum: 1
    },
    portal: {
      features: {
        authentication: true
      }
    },
    project: {
      collectionIds: ['focusedCollection'],
      byId: {
        focusedCollection: {}
      }
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onChangePath: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleResultsActionsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsActionsContainer component', () => {
  test('passes its props and renders a single GranuleResultsActions component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsActions).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsActions).props().collectionId).toEqual('focusedCollection')
    expect(enzymeWrapper.find(GranuleResultsActions).props().granuleCount).toEqual(100)
    expect(enzymeWrapper.find(GranuleResultsActions).props().isCollectionInProject).toEqual(true)
    expect(typeof enzymeWrapper.find(GranuleResultsActions).props().onAddProjectCollection).toEqual('function')
    expect(typeof enzymeWrapper.find(GranuleResultsActions).props().onRemoveCollectionFromProject).toEqual('function')
  })
})
