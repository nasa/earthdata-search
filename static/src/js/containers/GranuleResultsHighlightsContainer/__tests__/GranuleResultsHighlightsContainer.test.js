import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleResultsHighlightsContainer } from '../GranuleResultsHighlightsContainer'
import GranuleResultsHighlights from '../../../components/GranuleResultsHighlights/GranuleResultsHighlights'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collections: {
      allIds: ['focusedCollection'],
      byId: {
        focusedCollection: {
          excludedGranuleIds: [],
          metadata: {}
        }
      }
    },
    focusedCollection: 'focusedCollection',
    granules: {
      allIds: ['id1'],
      byId: {
        id1: {
          mock: 'data'
        }
      },
      hits: 1
    },
    location: { search: '' },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsHighlightsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsHighlightsContainer component', () => {
  test('passes its props and renders a single GranuleResultsHighlights component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsHighlights).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().granules).toEqual([{
      mock: 'data'
    }])
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().hits).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().limit).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().location).toEqual({ search: '' })
  })
})
