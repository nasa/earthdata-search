import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { ProjectCollectionsContainer } from '../ProjectCollectionsContainer'
import ProjectCollectionsList from '../../../components/ProjectCollections/ProjectCollectionsList'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          mock: 'data'
        }
      },
      projectIds: ['collectionId']
    },
    onRemoveCollectionFromProject: jest.fn()
  }

  const enzymeWrapper = shallow(<ProjectCollectionsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionsContainer component', () => {
  test('passes its props and renders a single ProjectCollectionsList component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ProjectCollectionsList).length).toBe(1)
    expect(enzymeWrapper.find(ProjectCollectionsList).props().collections).toEqual({
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          mock: 'data'
        }
      },
      projectIds: ['collectionId']
    })
    expect(typeof enzymeWrapper.find(ProjectCollectionsList).props().onRemoveCollectionFromProject).toEqual('function')
  })
})
