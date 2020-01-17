
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import AdminRetrieval from '../../../components/AdminRetrieval/AdminRetrieval'
import { AdminRetrievalContainer } from '../AdminRetrievalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    match: {
      params: {
        id: 1
      }
    },
    onFetchAdminRetrieval: jest.fn(),
    retrieval: {}
  }

  const enzymeWrapper = shallow(<AdminRetrievalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminRetrievalContainer component', () => {
  test('render AdminRetrieval with the correct props', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminRetrieval).length).toBe(1)
  })
})
