import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectCollectionItem from '../ProjectCollectionItem'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionId: 'collectionId',
    collection: {
      granules: {
        hits: 4,
        totalSize: { size: '4.0', unit: 'MB' }
      },
      metadata: {
        dataset_id: 'Collection Title',
        granule_count: 4
      }
    },
    color: 'color',
    onRemoveCollectionFromProject: jest.fn(),
    onToggleCollectionVisibility: jest.fn()
  }

  const enzymeWrapper = shallow(<ProjectCollectionItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionItem component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.collection-title').text()).toEqual('Collection Title')
    expect(enzymeWrapper.find('.granule-count').text()).toEqual('4 Granules')
    expect(enzymeWrapper.find('.total-size').text()).toEqual('4.0 MB')
  })

  test('Remove from project button calls onRemoveCollectionFromProject', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.remove-collection')

    button.simulate('click')
    expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
    expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')
  })

  test('Toggle visibility button calls onToggleCollectionVisibility', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.toggle-visibility')

    button.simulate('click')
    expect(props.onToggleCollectionVisibility).toHaveBeenCalledTimes(1)
    expect(props.onToggleCollectionVisibility).toHaveBeenCalledWith('collectionId')
  })
})
