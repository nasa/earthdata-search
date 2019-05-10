import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import FacetsModal from '../FacetsModal'
import FacetsModalNav from '../FacetsModalNav'
import FacetsList from '../FacetsList'
import Spinner from '../../Spinner/Spinner'

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
      expect(enzymeWrapper.prop('show')).toEqual(false)
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
      expect(enzymeWrapper.prop('show')).toEqual(true)
      expect(enzymeWrapper.find('.facets-modal__title').text()).toEqual('Filter collections by Test Category')
      expect(enzymeWrapper.find(Spinner).length).toEqual(1)
      expect(enzymeWrapper.find('.facets-modal__hits').length).toEqual(0)
      expect(enzymeWrapper.find('.facets-modal__action--cancel').length).toEqual(1)
      expect(enzymeWrapper.find('.facets-modal__action--apply').length).toEqual(1)
    })
  })

  describe('when modal is open and has loaded', () => {
    test('the modal renders correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        collectionHits: '100',
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
      expect(enzymeWrapper.prop('show')).toEqual(true)
      expect(enzymeWrapper.find('.facets-modal__title').text()).toEqual('Filter collections by Test Category')
      expect(enzymeWrapper.find(Spinner).length).toEqual(0)
      expect(enzymeWrapper.find(FacetsList).length).toEqual(1)
      expect(enzymeWrapper.find(FacetsModalNav).prop('activeLetters')).toEqual(['#', 'A', 'B'])
      expect(enzymeWrapper.find('.facets-modal__hits').text()).toEqual('100 Matching Collections')
      expect(enzymeWrapper.find('.facets-modal__action--cancel').length).toEqual(1)
      expect(enzymeWrapper.find('.facets-modal__action--apply').length).toEqual(1)
    })
  })

  describe('when the close button is clicked', () => {
    test('the callback fires correctly', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        collectionHits: '100',
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
        collectionHits: '100',
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
        collectionHits: '100',
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
      const changeHandler = enzymeWrapper.find(FacetsList).prop('changeHandler')
      changeHandler({}, { destination: '' })
      expect(props.onChangeViewAllFacet).toHaveBeenCalledTimes(1)
    })
  })
})
