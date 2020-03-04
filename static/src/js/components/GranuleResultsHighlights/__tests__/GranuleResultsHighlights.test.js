import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import GranuleResultsHighlights from '../GranuleResultsHighlights'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    granules: [{
      producer_granule_id: 'producer_granule_id_1',
      formatted_temporal: [
        '2020-03-04 19:30:00',
        '2020-03-04 19:35:00'
      ]
    }],
    hits: 5,
    limit: 1,
    location: { search: '' },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsHighlights {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsHighlights component', () => {
  test('displays granule ids and temporal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('granule-results-highlights')

    // TODO be more specific with where this text is visible
    expect(enzymeWrapper.text().includes('producer_granule_id_1')).toBeTruthy()
    expect(enzymeWrapper.text().includes('Start2020-03-04 19:30:00')).toBeTruthy()
    expect(enzymeWrapper.text().includes('End2020-03-04 19:35:00')).toBeTruthy()
    expect(enzymeWrapper.text().includes('Showing 1 of 5 matching granules')).toBeTruthy()
  })
})
