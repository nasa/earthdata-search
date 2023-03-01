import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import GranuleResultsHighlights from '../GranuleResultsHighlights'
import Skeleton from '../../Skeleton/Skeleton'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    granules: [{
      title: 'producer_granule_id_1',
      formattedTemporal: [
        '2020-03-04 19:30:00',
        '2020-03-04 19:35:00'
      ]
    }],
    granuleCount: 5,
    visibleGranules: 1,
    location: { search: '' },
    isLoading: true,
    isLoaded: false,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsHighlights {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsHighlights component', () => {
  test('renders the component', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('granule-results-highlights')
  })

  describe('granule count', () => {
    describe('when granules are loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.granule-results-highlights__count').find(Skeleton).length).toEqual(1)
      })
    })

    describe('when granules are loaded', () => {
      test('shows the count', () => {
        const { enzymeWrapper } = setup({
          isLoading: false,
          isLoaded: true
        })
        expect(enzymeWrapper.find('.granule-results-highlights__count').text()).toEqual('Showing 1 of 5 matching granules')
      })
    })
  })

  describe('granule ids and temporal', () => {
    describe('when granules are loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.granule-results-highlights__list').find(Skeleton).length).toEqual(3)
      })
    })

    describe('when granules are loaded', () => {
      test('displays the correct info', () => {
        const { enzymeWrapper } = setup({
          isLoading: false,
          isLoaded: true
        })
        expect(enzymeWrapper.find('.granule-results-highlights__temporal-row').at(0).text()).toEqual('Start2020-03-04 19:30:00')
        expect(enzymeWrapper.find('.granule-results-highlights__temporal-row').at(1).text()).toEqual('End2020-03-04 19:35:00')
        expect(enzymeWrapper.find('.granule-results-highlights__item-title').text()).toEqual('producer_granule_id_1')
      })
    })

    describe('when granules have no start time nor end time', () => {
      test('display not provided instead of date', () => {
        const { enzymeWrapper } = setup({
          isLoading: false,
          isLoaded: true,
          granules: [{
            title: 'producer_granule_id_1'
          }]
        })
        const row1 = enzymeWrapper.find('.granule-results-highlights__temporal-row').at(0)
        expect(row1.find('.granule-results-highlights__temporal-label').text()).toEqual('Start')
        expect(row1.find('.granule-results-highlights__temporal-value').text()).toEqual('Not Provided')

        const row2 = enzymeWrapper.find('.granule-results-highlights__temporal-row').at(1)
        expect(row2.find('.granule-results-highlights__temporal-label').text()).toEqual('End')
        expect(row2.find('.granule-results-highlights__temporal-value').text()).toEqual('Not Provided')
      })
    })
  })
})
