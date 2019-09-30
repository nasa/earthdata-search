import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleResultsActions from '../GranuleResultsActions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionId: 'collectionId',
    granuleCount: 5000,
    initialLoading: false,
    isCollectionInProject: false,
    location: {
      search: '?p=collectionId'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleResultsActions {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsActions component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
  })

  test('renders the granule count', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.granule-results-actions__granule-count').text()).toEqual('5,000 Granules')
  })

  test('renders a Download All button', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().children).toEqual('Download All')
    expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().badge).toEqual('5,000 Granules')
  })

  test('renders a link to add the collection to the project', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists('.granule-results-actions__proj-action--add')).toBeTruthy()
    expect(enzymeWrapper.exists('.remove-from-project')).toBeFalsy()
  })

  test('renders a link to remove the collection from the project', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({ isCollectionInProject: true })

    expect(enzymeWrapper.exists('.granule-results-actions__proj-action--remove')).toBeTruthy()
    expect(enzymeWrapper.exists('.granule-results-actions__proj-action--add')).toBeFalsy()
  })

  describe('addToProjectButton', () => {
    test('calls onAddProjectCollection', () => {
      const { enzymeWrapper, props } = setup()
      const button = enzymeWrapper.find('.granule-results-actions__proj-action--add')

      button.simulate('click')
      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('removeFromProjectButton', () => {
    test('calls onRemoveCollectionFromProject', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({ isCollectionInProject: true })
      const button = enzymeWrapper.find('.granule-results-actions__proj-action--remove')

      button.simulate('click')
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('downloadAllButton', () => {
    test('calls onAddProjectCollection', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.granule-results-actions__download-all')

      button.simulate('click')
      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
    })
  })
})
