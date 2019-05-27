import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectCollectionsList from '../ProjectCollectionsList'
import ProjectCollectionItem from '../ProjectCollectionItem'
import ProjectHeader from '../ProjectHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          mock: 'data 1'
        },
        collectionId2: {
          mock: 'data 2'
        }
      },
      projectIds: ['collectionId1', 'collectionId2']
    },
    onRemoveCollectionFromProject: jest.fn()
  }

  const enzymeWrapper = shallow(<ProjectCollectionsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ProjectHeader).length).toBe(1)
    expect(enzymeWrapper.find(ProjectHeader).props().collections).toEqual({
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          mock: 'data 1'
        },
        collectionId2: {
          mock: 'data 2'
        }
      },
      projectIds: ['collectionId1', 'collectionId2']
    })

    expect(enzymeWrapper.find(ProjectCollectionItem).length).toBe(2)
    expect(enzymeWrapper.find(ProjectCollectionItem).first().props().collectionId).toEqual('collectionId1')
    expect(enzymeWrapper.find(ProjectCollectionItem).first().props().collection).toEqual({
      mock: 'data 1'
    })
    expect(typeof enzymeWrapper.find(ProjectCollectionItem).first().props().onRemoveCollectionFromProject).toEqual('function')

    expect(enzymeWrapper.find(ProjectCollectionItem).last().props().collectionId).toEqual('collectionId2')
    expect(enzymeWrapper.find(ProjectCollectionItem).last().props().collection).toEqual({
      mock: 'data 2'
    })
    expect(typeof enzymeWrapper.find(ProjectCollectionItem).last().props().onRemoveCollectionFromProject).toEqual('function')
  })
})
