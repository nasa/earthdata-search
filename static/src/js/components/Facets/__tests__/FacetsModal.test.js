import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import FacetsModal from '../FacetsModal'
import FacetsModalNav from '../FacetsModalNav'
import FacetsList from '../FacetsList'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionHits: null,
    viewAllFacets: {
      allIds: [],
      byId: {},
      hits: null,
      isLoaded: false,
      isLoading: false
    },
    isOpen: false,
    onApplyViewAllFacets: jest.fn(),
    onChangeViewAllFacet: jest.fn(),
    onToggleFacetsModal: jest.fn()
  }

  const enzymeWrapper = shallow(<FacetsModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FacetsModal component', () => {
  describe('when selected category is not defined', () => {
    test('the modal does not render', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.html()).toEqual(null)
    })
  })

  describe('when selected category is defined', () => {
    test('the modal is not visible', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        viewAllFacets: {
          allIds: ['Test Category'],
          byId: {
            'Test Category': {}
          },
          hits: null,
          isLoaded: false,
          isLoading: false,
          selectedCategory: 'Test Category'
        }
      })
      expect(enzymeWrapper.prop('isOpen')).toEqual(false)
    })
  })

  describe('when modal is open and is loading', () => {
    test('the modal renders correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        viewAllFacets: {
          allIds: [],
          byId: {
            'Test Category': {}
          },
          hits: null,
          isLoaded: false,
          isLoading: true,
          selectedCategory: 'Test Category'
        },
        isOpen: true
      })

      expect(enzymeWrapper.prop('isOpen')).toEqual(true)
      expect(enzymeWrapper.prop('title')).toEqual('Filter collections by Test Category')
      expect(enzymeWrapper.prop('spinner')).toEqual(true)
      expect(enzymeWrapper.prop('innerHeader').type).toEqual(FacetsModalNav)
      expect(enzymeWrapper.prop('body').type).toEqual(FacetsList)
      expect(enzymeWrapper.prop('footerMeta').type).toEqual(undefined)
    })
  })

  describe('when modal is open and has loaded', () => {
    test('the modal renders correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        collectionHits: 100,
        viewAllFacets: {
          allIds: ['Test Category'],
          byId: {
            'Test Category': {
              title: 'Test Category',
              children: [
                {
                  title: '1234'
                },
                {
                  title: 'Another'
                }
              ],
              startingLetters: ['#', 'A', 'B']
            }
          },
          hits: 100,
          isLoaded: true,
          isLoading: false,
          selectedCategory: 'Test Category'
        },
        isOpen: true
      })

      expect(enzymeWrapper.prop('isOpen')).toEqual(true)
      expect(enzymeWrapper.prop('title')).toEqual('Filter collections by Test Category')
      expect(enzymeWrapper.prop('spinner')).toEqual(false)
      expect(enzymeWrapper.prop('innerHeader').type).toEqual(FacetsModalNav)
      expect(enzymeWrapper.prop('body').type).toEqual(FacetsList)
      expect(enzymeWrapper.prop('footerMeta').type).toEqual('span')
    })
  })

  describe('when the close button is clicked', () => {
    test('the callback fires correctly', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        collectionHits: 100,
        viewAllFacets: {
          allIds: ['Test Category'],
          byId: {
            'Test Category': {
              title: 'Test Category',
              children: [
                {
                  title: '1234'
                },
                {
                  title: 'Another'
                }
              ],
              startingLetters: ['#', 'A', 'B']
            }
          },
          hits: 100,
          isLoaded: true,
          isLoading: false,
          selectedCategory: 'Test Category'
        },
        isOpen: true
      })
      enzymeWrapper.instance().onModalClose()
      expect(props.onToggleFacetsModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleFacetsModal).toHaveBeenCalledWith(false)
    })
  })

  describe('when the apply button is clicked', () => {
    test('the callback fires correctly', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        collectionHits: 100,
        viewAllFacets: {
          allIds: ['Test Category'],
          byId: {
            'Test Category': {
              title: 'Test Category',
              children: [
                {
                  title: '1234'
                },
                {
                  title: 'Another'
                }
              ],
              startingLetters: ['#', 'A', 'B']
            }
          },
          hits: 100,
          isLoaded: true,
          isLoading: false,
          selectedCategory: 'Test Category'
        },
        isOpen: true
      })
      enzymeWrapper.instance().onApplyClick()
      expect(props.onApplyViewAllFacets).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the change handler button is fired', () => {
    test('the callback fires correctly', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        collectionHits: 100,
        viewAllFacets: {
          allIds: ['Test Category'],
          byId: {
            'Test Category': {
              title: 'Test Category',
              children: [
                {
                  title: '1234'
                },
                {
                  title: 'Another'
                }
              ],
              startingLetters: ['#', 'A', 'B']
            }
          },
          hits: 100,
          isLoaded: true,
          isLoading: false,
          selectedCategory: 'Test Category'
        },
        isOpen: true
      })
      const { changeHandler } = enzymeWrapper.prop('body').props
      changeHandler({}, { destination: '' })
      expect(props.onChangeViewAllFacet).toHaveBeenCalledTimes(1)
    })
  })
})
