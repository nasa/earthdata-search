import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import RegionSearchResults from '../RegionSearchResults'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    regionSearchResults: {
      byId: {},
      allIds: []
    },
    setModalOverlay: jest.fn(),
    setFieldValue: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<RegionSearchResults {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('RegionSearchResults component', () => {
  test('should render the region search form results', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toEqual('div')
  })

  test('should render a note to select a region', () => {
    const { enzymeWrapper } = setup({
      regionSearchResults: {
        isLoading: false,
        isLoaded: true,
        byId: {
          1234: {
            name: 'Upper Creek',
            id: '1234',
            type: 'huc'
          }
        },
        allIds: ['1234']
      }
    })

    expect(enzymeWrapper.find('.region-search-results__list-intro').text())
      .toContain('Select a region from the list below to filter your search results')
  })

  describe('onSetSelected', () => {
    test('sets the field value', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onSetSelected({
        test: 'test'
      })

      expect(props.setFieldValue).toHaveBeenCalledTimes(1)
      expect(props.setFieldValue).toHaveBeenCalledWith(
        'regionSearch.selectedRegion',
        {
          test: 'test'
        }
      )
    })
  })
})
