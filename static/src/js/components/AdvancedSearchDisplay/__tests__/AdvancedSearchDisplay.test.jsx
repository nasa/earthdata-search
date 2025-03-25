import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import FilterStackItem from '../../FilterStack/FilterStackItem'
import AdvancedSearchDisplay from '../AdvancedSearchDisplay'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    advancedSearch: {},
    onUpdateAdvancedSearch: jest.fn(),
    onChangeQuery: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AdvancedSearchDisplay {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdvancedSearchDisplay component', () => {
  describe('with no active advancedSearch filters', () => {
    test('should render self without display', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.html()).toBe(null)
    })

    describe('when a filter is set to false', () => {
      test('should render self without display', () => {
        const { enzymeWrapper } = setup({
          advancedSearch: {
            regionSearch: false
          }
        })

        expect(enzymeWrapper.html()).toBe(null)
      })
    })
  })

  describe('with active advancedSearch filters', () => {
    test('should display the filter stack item', () => {
      const { enzymeWrapper } = setup({
        advancedSearch: {
          regionSearch: {
            selectedRegion: {
              test: 'test'
            }
          }
        }
      })

      expect(enzymeWrapper.find(FilterStackItem).length).toEqual(1)
    })
  })

  describe('FilterStackItem', () => {
    describe('onRemove', () => {
      test('calls the callbacks to update the advanced search and query states', () => {
        const { enzymeWrapper, props } = setup({
          advancedSearch: {
            regionSearch: {
              selectedRegion: {
                test: 'test'
              }
            }
          }
        })

        enzymeWrapper.find(FilterStackItem).prop('onRemove')()

        expect(props.onUpdateAdvancedSearch).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdvancedSearch).toHaveBeenCalledWith({})
        expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
        expect(props.onChangeQuery).toHaveBeenCalledWith({
          collection: {
            spatial: {}
          }
        })
      })
    })
  })
})
