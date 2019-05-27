import React, { Fragment } from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import GranuleResultsHeaderActions from '../GranuleResultsHeaderActions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionId: 'collectionId',
    granuleCount: 5,
    isCollectionInProject: false,
    location: {
      search: '?p=collectionId'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleResultsHeaderActions {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsHeaderActions component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(Fragment)
  })

  test('renders the granule count', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.granule-count').text()).toEqual('5 Granules')
  })

  test('renders a Download All button', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.secondary-toolbar__project').text()).toEqual('Download All5 Granules')
  })

  test('renders a link to add the collection to the project', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists('.add-to-project')).toBeTruthy()
    expect(enzymeWrapper.exists('.remove-from-project')).toBeFalsy()
  })

  test('renders a link to remove the collection from the project', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({ isCollectionInProject: true })

    expect(enzymeWrapper.exists('.remove-from-project')).toBeTruthy()
    expect(enzymeWrapper.exists('.add-to-project')).toBeFalsy()
  })

  describe('addToProjectButton', () => {
    test('calls onAddProjectCollection', () => {
      const { enzymeWrapper, props } = setup()
      const button = enzymeWrapper.find('.add-to-project')

      button.simulate('click')
      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('removeFromProjectButton', () => {
    test('calls onRemoveCollectionFromProject', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({ isCollectionInProject: true })
      const button = enzymeWrapper.find('.remove-from-project')

      button.simulate('click')
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('downloadAllButton', () => {
    test('calls onAddProjectCollection', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.download-all')

      button.simulate('click')
      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
    })
  })
})
