import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import GranuleResultsItem from '../GranuleResultsItem'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {

  let props

  if (type === 'cmr') {
    props = {
      granule: {
        browse_flag: true,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        thumbnail: '/fake/path/image.jpg',
        title: 'Granule title'
      }
    }
  }

  if (type === 'no-thumb') {
    props = {
      granule: {
        browse_flag: false,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        title: 'Granule title'
      }
    }
  }

  if (type === 'cwic') {
    props = {
      granule: {
        browse_flag: true,
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        producer_granule_id: 'Granule title',
        thumbnail: '/fake/path/image.jpg'
      }
    }
  }

  const enzymeWrapper = shallow(<GranuleResultsItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsItem component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup('cmr')

    expect(enzymeWrapper.type()).toBe('li')
  })

  describe('when passed a CMR granule', () => {
    test('renders the title', () => {
      const { enzymeWrapper } = setup('cmr')

      expect(enzymeWrapper.find('.granule-results-item__title').text()).toEqual('Granule title')
    })

    test('renders the image', () => {
      const { enzymeWrapper } = setup('cmr')

      expect(enzymeWrapper.find('.granule-results-item__thumb').find('img').prop('src')).toEqual('/fake/path/image.jpg')
    })

    test('renders the start and end date', () => {
      const { enzymeWrapper } = setup('cmr')

      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('h5').text()).toEqual('Start')
      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('p').text()).toEqual('2019-04-28 00:00:00')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('h5').text()).toEqual('End')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('p').text()).toEqual('2019-04-29 23:59:59')
    })

    describe('without an thumbnail', () => {
      test('does not render an thumbnail', () => {
        const { enzymeWrapper } = setup('no-thumb')

        expect(enzymeWrapper.find('.granule-results-item__thumb').length).toEqual(0)
      })
    })
  })

  describe('when passed a CWIC granule', () => {
    test('renders the title', () => {
      const { enzymeWrapper } = setup('cwic')

      expect(enzymeWrapper.find('.granule-results-item__title').text()).toEqual('Granule title')
    })

    test('renders the image', () => {
      const { enzymeWrapper } = setup('cwic')

      expect(enzymeWrapper.find('.granule-results-item__thumb').find('img').prop('src')).toEqual('/fake/path/image.jpg')
    })

    test('renders the start and end date', () => {
      const { enzymeWrapper } = setup('cwic')

      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('h5').text()).toEqual('Start')
      expect(enzymeWrapper.find('.granule-results-item__temporal--start').find('p').text()).toEqual('2019-04-28 00:00:00')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('h5').text()).toEqual('End')
      expect(enzymeWrapper.find('.granule-results-item__temporal--end').find('p').text()).toEqual('2019-04-29 23:59:59')
    })
  })
})
