import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectHeader from '../ProjectHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          granules: {
            hits: 4,
            totalSize: { size: '4.0', unit: 'MB' }
          },
          metadata: {
            mock: 'data 1'
          }
        },
        collectionId2: {
          granules: {
            hits: 5,
            totalSize: { size: '5.0', unit: 'MB' }
          },
          metadata: {
            mock: 'data 2'
          }
        }
      },
      projectIds: ['collectionId1', 'collectionId2']
    }
  }

  const enzymeWrapper = shallow(<ProjectHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectHeader component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('div').length).toBe(1)
    expect(enzymeWrapper.find('.total-granules').text()).toEqual('9 Granules')
    expect(enzymeWrapper.find('.total-collections').text()).toEqual('2 Collections')
    expect(enzymeWrapper.find('.total-size').text()).toEqual('9.0 MB')
  })
})
